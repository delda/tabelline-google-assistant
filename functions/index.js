'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const log = true;
const version = '0.5.21';

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
    limitQuestions: 5
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
    mult.multiplier = getRandomNumber(1, 4);
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
    log && console.log('le-tabelline v' + version);

    function fallback(agent) {
        log && console.log('[fallback]');
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function playAgain(agent) {
        log && console.log('[playAgain]');

        let data = agent.getContext('data');
        let confirmation = agent.parameters.confirmation;
        let speech = '';

        switch (confirmation) {
            case 'sì':
                data.parameters.smartQuestion = data.parameters.smartQuestion === 'up' ? 'down' : 'up';
                data.parameters.operation = smartMultiplication(data.parameters.smartQuestion, data.parameters.multiplications);
                data.parameters.multiplications = addMultiplicationTable(data.parameters.operation, data.parameters.multiplications);
                data.parameters.totalQuestions++;
                speech += 'Quanto fa ' +
                    data.parameters.operation.multiplier +
                    ' per ' +
                    data.parameters.operation.multiplicand +
                    '?';
                break;
            case 'no':
                speech += 'Alla prossima!';
                agent.close(speech);
                return;
            default:
                speech += 'Non ho capito; vuoi continuare a giocare?';
                break;
        }

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: data.parameters
        });

        agent.add(speech);
    }

    function reply(agent) {
        log && console.log('[reply]');

        let data = agent.getContext('data');
        let guessedNumber = agent.parameters.guessedNumber;
        let speech = '';

        if (guessedNumber === data.parameters.operation.result) {
            speech += 'Bravo! ';
            data.parameters.rightResponses++;
            data.parameters.firstAttempt = true;
        } else {
            if (data.parameters.firstAttempt === true) {
                speech += 'No, prova ancora. ' +
                    'Quanto fa ' +
                    data.parameters.operation.multiplier +
                    ' per ' +
                    data.parameters.operation.multiplicand +
                    '? ';
                data.parameters.firstAttempt = false;
            } else {
                speech += 'No: ' +
                    data.parameters.operation.multiplier +
                    ' per ' +
                    data.parameters.operation.multiplicand +
                    ' fa ' +
                    data.parameters.operation.result +
                    '. ';
                data.parameters.firstAttempt = true;
            }
        }

        log && console.log('# questions');
        log && console.log(data.parameters.totalQuestions);
        log && console.log(data.parameters.limitQuestions);
        log && console.log(data.parameters.totalQuestions % data.parameters.limitQuestions);
        if (data.parameters.firstAttempt === true) {
            if (data.parameters.totalQuestions % data.parameters.limitQuestions === 0) {
                speech += 'Hai risposto correttamente a ' +
                    data.parameters.rightResponses +
                    ' domande su ' +
                    data.parameters.totalQuestions +
                    '. Vuoi continuare?';
            } else {
                data.parameters.smartQuestion = data.parameters.smartQuestion === 'up' ? 'down' : 'up';
                data.parameters.operation = smartMultiplication(data.parameters.smartQuestion, data.parameters.multiplications);
                data.parameters.multiplications = addMultiplicationTable(data.parameters.operation, data.parameters.multiplications);
                data.parameters.totalQuestions++;
                speech += 'Quanto fa ' +
                    data.parameters.operation.multiplier +
                    ' per ' +
                    data.parameters.operation.multiplicand +
                    '?';
            }
        }

        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: data.parameters
        });

        agent.add(speech);
    }

    function welcome(agent) {
        log && console.log('[welcome]');
        let speech = 'Ciao! ';

        let parameters = Parameters;
        parameters.operation = smartMultiplication('down', parameters.multiplications);
        parameters.totalQuestions++;
        speech += 'Quanto fa ' +
            parameters.operation.multiplier +
            ' per ' +
            parameters.operation.multiplicand +
            '?';
        parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: parameters
        });

        agent.add(speech);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('fallback', fallback);
    intentMap.set('play_again', playAgain);
    intentMap.set('reply', reply);
    intentMap.set('start_game', welcome);

    agent.handleRequest(intentMap);
});
