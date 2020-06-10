'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');

const log = true;
const version = '1.02.19';

const Statuses = {
    START: 0,
    FIRST_ATTEMPT: 1,
    SECOND_ATTEMPT: 2,
    CONFIRM: 3,
};

const Multiplication = {
    multiplier: 0,
    multiplicand: 0,
    result: 0
};

const Parameters = {
    operation: null,
    smartQuestion: 'down',
    multiplications: Array.from({ length:10 }, () => (Array.from({ length:10 }, () => null))),
    firstAttempt: true,
    totalQuestions: 0,
    rightResponses: 0,
    limitQuestions: 5,
    status: Statuses.START,
};

const context = {
    it: {
        dont_understand: [
            'Non ho capito',
        ],
        multiplication: [
            '%MULTIPLIER% per %MULTIPLICAND% fa %RESULT%'
        ],
        next_time: [
            'Alla prossima!',
            'Ciao, alla prossima!'
        ],
        no: [
            'No'
        ],
        ok: [
            'Bravo!'
        ],
        response: [
            'Hai risposto correttamente a %QUESTIONS% domande su %RIGHT_QUESTIONS%.',
        ],
        try_again: [
            'No, prova ancora!'
        ],
        welcome: [
            'Ciao!',
        ],
        what_is: [
            'Quanto fa %MULTIPLIER% per %MULTIPLICAND%?'
        ],
        wish_continue: [
            'Vuoi continuare?'
        ]
    },
    en: {
        dont_understand: [
            'I don\'t understand',
        ],
        multiplication: [
            '%MULTIPLIER% times %MULTIPLICAND% is %RESULT%'
        ],
        next_time: [
            'See you!'
        ],
        no: [
            'No'
        ],
        ok: [
            'Good!'
        ],
        response: [
            'You answered correctly on %QUESTIONS% questions of %RIGHT_QUESTIONS%.',
        ],
        try_again: [
            'No, try again'
        ],
        welcome: [
            'Hi!',
        ],
        what_is: [
            'What is %MULTIPLIER% times %MULTIPLICAND%?'
        ],
        wish_continue: [
            'Do you wish to continue?'
        ]
    }
};

const i18n = {
    context: context,
    language: 'it',
    get: function(type) {
        var sizeOfText = this.context[this.language][type].length;
        var index = getRandomNumber(0, sizeOfText-1);
        return this.context[this.language][type][index];
    },
    setLanguage: function(lang) {
        this.language = lang;
    }
};

process.env.DEBUG = 'dialogflow:debug';

function addMultiplicationTable(operation, multiplications) {
    multiplications[operation.multiplier-1][operation.multiplicand-1] = operation.result;

    return multiplications;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMultiplication(smartQuestion = 'down') {
    let mult = Multiplication;
    mult.multiplier = getRandomNumber(1, 10);
    if (smartQuestion === 'down') {
        mult.multiplicand = getRandomNumber(0, 4);
    } else {
        mult.multiplicand = getRandomNumber(5, 9);
    }
    mult.result = mult.multiplier * mult.multiplicand;

    return mult;
}

function smartMultiplication(smartQuestion = 'down', multiplications) {
    let min, max, result;
    do {
        result = randomMultiplication(smartQuestion);
    } while (multiplications[result.multiplier-1][result.multiplicand-1] !== null);

    return result;
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    log && console.log('le-tabelline v' + version + ' ' + agent.locale);
    i18n.setLanguage(agent.locale);

    function endOfGame(agent) {
        log && console.log('[endOfGame]');

        let parameters = agent.getContext('data').parameters;
        let speech = '';
        speech += i18n.get('response') +
            ' ' +
            i18n.get('next_time');
        speech = speech.replace('%QUESTIONS%', parameters.rightResponses);
        speech = speech.replace('%RIGHT_QUESTIONS%', parameters.totalQuestions);
        let conv = agent.conv();
        conv.close(speech);
    }

    function fallback(agent) {
        log && console.log('[fallback]');
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function playAgain(agent) {
        log && console.log('[playAgain]');
        let parameters = agent.getContext('data').parameters;
        console.log(parameters);
        let speech = '';
        let confirmation = parameters.confirmation;

        if (parameters.status !== Statuses.CONFIRM) {
            console.log('no confirm');
            speech += i18n.get('dont_understand') + '.';
            speech += ' ' + i18n.get('what_is');
            speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier);
            speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand);
            console.log(speech);
        } else {
            console.log('confirm');
            switch (confirmation) {
                case 'sì':
                    parameters.smartQuestion = parameters.smartQuestion === 'up' ? 'down' : 'up';
                    parameters.operation = smartMultiplication(parameters.smartQuestion, parameters.multiplications);
                    parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
                    parameters.totalQuestions++;
                    speech += i18n.get('what_is');
                    speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier);
                    speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand);
                    break;
                case 'no':
                    speech += ' ' + i18n.get('next_time');
                    let conv = agent.conv();
                    conv.close(speech);
                    const data2 = conv.serialize();
                    agent.add(new Payload(
                        'ACTIONS_ON_GOOGLE',
                        data2.payload.google));
                    break;
            }
        }
        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function reply(agent) {
        log && console.log('[reply]');

        let parameters = agent.getContext('data').parameters;
        let guessedNumber = parameters.guessedNumber;
        let speech = '';

        if (guessedNumber === parameters.operation.result) {
            speech += i18n.get('ok');
            parameters.rightResponses++;
            parameters.status = Statuses.FIRST_ATTEMPT;
        } else {
            if (parameters.status === Statuses.FIRST_ATTEMPT) {
                speech += i18n.get('try_again');
                speech += ' ' + i18n.get('what_is');
                speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
                speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
                parameters.status = Statuses.SECOND_ATTEMPT;
            } else {
                speech += i18n.get('no') +
                    ': ' +
                    i18n.get('multiplication') +
                    '. ';
                speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
                speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
                speech = speech.replace('%RESULT%', parameters.operation.result.toString());
                parameters.status = Statuses.FIRST_ATTEMPT;
            }
        }

        if (parameters.status === Statuses.FIRST_ATTEMPT) {
            if (parameters.totalQuestions % parameters.limitQuestions === 0) {
                speech += ' ' + i18n.get('response');
                speech = speech.replace('%QUESTIONS%', parameters.rightResponses);
                speech = speech.replace('%RIGHT_QUESTIONS%', parameters.totalQuestions);
                speech += ' ' + i18n.get('wish_continue');
                parameters.status = Statuses.CONFIRM;
            } else {
                parameters.smartQuestion = parameters.smartQuestion === 'up' ? 'down' : 'up';
                parameters.operation = smartMultiplication(parameters.smartQuestion, parameters.multiplications);
                parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
                parameters.totalQuestions++;
                speech += ' ' + i18n.get('what_is');
                speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
                speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
            }
        }

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function welcome(agent) {
        log && console.log('[welcome]');
        let speech = '';
        let parameters = Parameters;

        parameters.operation = smartMultiplication('down', parameters.multiplications);
        parameters.totalQuestions++;
        speech += i18n.get('welcome');
        speech += ' ' + i18n.get('what_is');
        speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
        speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
        parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
        parameters.status = Statuses.FIRST_ATTEMPT;

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('end_of_game', endOfGame);
    intentMap.set('fallback', fallback);
    intentMap.set('play_again', playAgain);
    intentMap.set('reply', reply);
    intentMap.set('start_game', welcome);

    agent.handleRequest(intentMap);
});
