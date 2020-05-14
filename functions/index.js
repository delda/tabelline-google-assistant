'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');

const log = true;
const version = '0.5.39';

const Statuses = {
    START: 0,
    QUESTION: 1,
    CONFIRM: 2,
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

    function endOfGame(agent) {
        log && console.log('[endOfGame]');

        let parameters = agent.getContext('data').parameters;
        let speech = '';
        speech += 'Hai risposto correttamente a ' +
            parameters.rightResponses +
            ' domand' +
            ((parameters.rightResponses == 1) ? 'a' : 'e') +
            ' su ' +
            parameters.totalQuestions +
            '. Alla prossima!';
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
        let conv = agent.conv();
        let speech = '';
        let data = agent.getContext('data');
        let confirmation = agent.parameters.confirmation;

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
                log && console.log('*** no!');
                speech += 'Ciao! Alla prossima!';
                log && console.log(speech);
                let conv = agent.conv();
                log && console.log(conv);
                conv.close(speech);
                const data2 = conv.serialize();
                agent.add(new Payload(
                    'ACTIONS_ON_GOOGLE',
                    data2.payload.google));
                log && console.log('post conv.close()');
                break;
            default:
                speech += 'Non ho capito; vuoi continuare a giocare?';
                break;
        }

        log && console.log('confirmation');
        if (confirmation === 'sì') {
            agent.setContext({
                name: 'data',
                lifespan: 1,
                parameters: data.parameters
            });

            agent.add(speech);
        }
        log && console.log('end confirmation');
    }

    function reply(agent) {
        log && console.log('[reply]');

        let parameters = agent.getContext('data').parameters;
        let guessedNumber = parameters.guessedNumber;
        let speech = '';

        if (guessedNumber === parameters.operation.result) {
            speech += 'Bravo! ';
            parameters.rightResponses++;
            parameters.firstAttempt = true;
            parameters.status = Statuses.QUESTION;
        } else {
            if (parameters.firstAttempt === true) {
                speech += 'No, prova ancora. ' +
                    'Quanto fa ' +
                    parameters.operation.multiplier +
                    ' per ' +
                    parameters.operation.multiplicand +
                    '? ';
                parameters.firstAttempt = false;
            } else {
                speech += 'No: ' +
                    parameters.operation.multiplier +
                    ' per ' +
                    parameters.operation.multiplicand +
                    ' fa ' +
                    parameters.operation.result +
                    '. ';
                parameters.firstAttempt = true;
            }
            parameters.status = Statuses.QUESTION;
        }

        if (parameters.firstAttempt === true) {
            if (parameters.totalQuestions % parameters.limitQuestions === 0) {
                speech += 'Hai risposto correttamente a ' +
                    parameters.rightResponses +
                    ' domand' +
                    ((parameters.rightResponses == 1) ? 'a' : 'e') +
                    ' su ' +
                    parameters.totalQuestions +
                    '. Vuoi continuare?';
                parameters.status = Statuses.CONFIRM;
            } else {
                parameters.smartQuestion = parameters.smartQuestion === 'up' ? 'down' : 'up';
                parameters.operation = smartMultiplication(parameters.smartQuestion, parameters.multiplications);
                parameters.multiplications = addMultiplicationTable(parameters.operation, parameters.multiplications);
                parameters.totalQuestions++;
                speech += 'Quanto fa ' +
                    parameters.operation.multiplier +
                    ' per ' +
                    parameters.operation.multiplicand +
                    '?';
                parameters.status = Statuses.QUESTION;
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
        parameters.status = Statuses.QUESTION;

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
