'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');

const log = true;
const version = '1.06.01';

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
    profanity: 0,
};

const context = {
    it: {
        bye_bye: [
            'Alla prossima!',
            'Ciao, alla prossima!',
        ],
        dont_understand: [
            'Non ho capito.',
        ],
        multiplication: [
            '%MULTIPLIER% per %MULTIPLICAND% fa %RESULT%.',
        ],
        no: [
            'No',
        ],
        no_profanity: [
            'Non tollero i turpiloqui.',
            'Evita parole inutili.',
            'Non servono a nulla le tue parole offensive.',
            'Lascia stare le parolacce.',
            'Non mi piaccino le scurrilità.',
            'Non essere triviale.',
            'Vai a controllare cosa siano le turpitudini.',
            'Cerca di evitare le volgarità.',
            'Cosa c\'è di male? Non saprei.',
        ],
        ok: [
            'Ok!',
        ],
        response: [
            'Hai risposto correttamente a %QUESTIONS% domande su %RIGHT_QUESTIONS%.',
        ],
        right: [
            'Bravo!',
        ],
        try_again: [
            'No, prova ancora!',
        ],
        welcome: [
            'Ciao!',
        ],
        what_is: [
            'Quanto fa %MULTIPLIER% per %MULTIPLICAND%?',
        ],
        wish_continue: [
            'Vuoi continuare?',
        ]
    },
    en: {
        bye_bye: [
            'Bye bye!',
            'See you!',
        ],
        dont_understand: [
            'I don\'t understand.',
        ],
        multiplication: [
            '%MULTIPLIER% times %MULTIPLICAND% is %RESULT%',
        ],
        no: [
            'No',
        ],
        no_profanity: [
            'Please, no profanity in this game.'
        ],
        ok: [
            'Ok!',
        ],
        response: [
            'You answered correctly on %QUESTIONS% questions of %RIGHT_QUESTIONS%.',
        ],
        right: [
            'Good!',
        ],
        try_again: [
            'No, try again',
        ],
        welcome: [
            'Hi!',
        ],
        what_is: [
            'What is %MULTIPLIER% times %MULTIPLICAND%?',
        ],
        wish_continue: [
            'Do you wish to continue?',
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
    let result;
    do {
        result = randomMultiplication(smartQuestion);
    } while (multiplications[result.multiplier-1][result.multiplicand-1] !== null);

    return result;
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    log && console.log('le-tabelline v' + version + '-' + agent.locale);
    log && console.log('session: ' + agent.session);
    i18n.setLanguage(agent.locale);

    function answer(agent) {
        log && console.log('['+agent.intent+']');

        let parameters = agent.getContext('data').parameters;
        let guessedNumber = parameters.guessedNumber;
        let speech = '';

        if (parameters === Statuses.CONFIRM) {
            speech += i18n.get('dont_understand') + '.';
            speech += ' ' + i18n.get('wish_continue');
        } else {
            if (guessedNumber === parameters.operation.result) {
                speech += i18n.get('right');
                parameters.rightResponses++;
                parameters.status = Statuses.FIRST_ATTEMPT;
            } else {
                if (parameters.status === Statuses.SECOND_ATTEMPT) {
                    speech += i18n.get('no') +
                        ' ' +
                        i18n.get('multiplication');
                    speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
                    speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
                    speech = speech.replace('%RESULT%', parameters.operation.result.toString());
                    parameters.status = Statuses.FIRST_ATTEMPT;
                } else {
                    speech += i18n.get('try_again');
                    speech += ' ' + i18n.get('what_is');
                    speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
                    speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
                    parameters.status = Statuses.SECOND_ATTEMPT;
                }
            }

            if (parameters.status === Statuses.FIRST_ATTEMPT) {
                if (parameters.totalQuestions % parameters.limitQuestions === 0) {
                    speech += ' ' + i18n.get('response');
                    if (parameters.rightResponses === 1) {
                        speech = speech.replace('domande', 'domanda');
                    }
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
        }

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function endGame(agent) {
        log && console.log('['+agent.intent+']');

        let parameters = agent.getContext('data').parameters;
        let speech = i18n.get('bye_bye');
        let conv = agent.conv();
        conv.close(speech);
        const data2 = conv.serialize();
        agent.add(new Payload(
            'ACTIONS_ON_GOOGLE',
            data2.payload.google));

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function nextQuestion(agent) {
        log && console.log('[nextQuestion]');

        let parameters = agent.getContext('data').parameters;
        let speech = i18n.get('ok');
        speech += ' ' + i18n.get('multiplication');
        speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier.toString());
        speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand.toString());
        speech = speech.replace('%RESULT%', parameters.operation.result.toString());
        parameters.smartQuestion = Statuses.FIRST_ATTEMPT;
        parameters.smartQuestion = parameters.smartQuestion === 'up' ? 'down' : 'up';
        parameters.operation = smartMultiplication(parameters.smartQuestion, parameters.multiplications);
        parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
        parameters.totalQuestions++;
        speech += ' ' + i18n.get('what_is');
        speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier);
        speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand);

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function playAgain(agent) {
        log && console.log('['+agent.intent+']');

        let parameters = agent.getContext('data').parameters;
        let speech = '';
        let confirmation = parameters.confirmation;

        if (parameters.status !== Statuses.CONFIRM) {
            speech += i18n.get('dont_understand') + '.';
            speech += ' ' + i18n.get('what_is');
            speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier);
            speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand);
        } else {
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
                    speech += ' ' + i18n.get('bye_bye');
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

    function profanityWords(agent) {
        log && console.log('['+agent.intent+']');

        let parameters = agent.getContext('data').parameters;
        let speech = '';

        if (parameters.profanity > 0) {
            speech += i18n.get('no_profanity');
            speech += ' ' + i18n.get('response');
            speech = speech.replace('%QUESTIONS%', parameters.rightResponses);
            speech = speech.replace('%RIGHT_QUESTIONS%', parameters.totalQuestions);
            speech += ' ' + i18n.get('bye_bye');
            let conv = agent.conv();
            conv.close(speech);
            const data = conv.serialize();
            agent.add(new Payload(
                'ACTIONS_ON_GOOGLE',
                data.payload.google));
            return;
        }

        speech += i18n.get('no_profanity');
        speech += ' ' + i18n.get('what_is');
        speech = speech.replace('%MULTIPLIER%', parameters.operation.multiplier);
        speech = speech.replace('%MULTIPLICAND%', parameters.operation.multiplicand);
        parameters.profanity++;

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    function welcome(agent) {
        log && console.log('['+agent.intent+']');

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
    intentMap.set('answer', answer);
    intentMap.set('dont_know', nextQuestion);
    intentMap.set('end_game', endGame);
    intentMap.set('fallback', endGame);
    intentMap.set('next_question', nextQuestion);
    intentMap.set('play_again', playAgain);
    intentMap.set('profanity_words', profanityWords);
    intentMap.set('start_game', welcome);

    agent.handleRequest(intentMap);
});
