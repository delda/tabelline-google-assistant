'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const log = true;
const version = '0.1.38';

const Multiplication = {
    multiplier: 0,
    multiplicand: 0,
    result: 0
};

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function randomMultiplication() {
    let mult = Multiplication;
    mult.multiplier = getRandomNumber(1, 4);
    mult.multiplicand = getRandomNumber(0, 9);
    mult.result = mult.multiplier * mult.multiplicand;

    return mult;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    log && console.log('le-tabelline v' + version);

    function fallback(agent) {
        log && console.log('[fallback]');
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function reply(agent) {
        log && console.log('[reply]');

        let data = agent.getContext('data');
        let guessedNumber = agent.parameters.guessedNumber;
        let speech = '';
        log && console.log(data.parameters);

        if (guessedNumber === data.parameters.result) {
            speech += 'Bravo! ';
        } else {
            console.log(data.parameters);
            speech += 'No: ' +
                data.parameters.multiplier +
                ' per ' +
                data.parameters.multiplicand +
                ' fa ' +
                data.parameters.result +
                '. ';
        }

        let operation = randomMultiplication();
        speech += 'Quanto fa ' +
            operation.multiplier +
            ' per ' +
            operation.multiplicand +
            '?';
        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: operation
        });

        agent.add(speech);
    }

    function welcome(agent) {
        log && console.log('[welcome]');
        let speech = 'Ciao! ';

        let operation = randomMultiplication();
        speech += 'Quanto fa ' +
            operation.multiplier +
            ' per ' +
            operation.multiplicand +
            '?';
        agent.setContext({
            name: 'data',
            lifespan: 1,
            parameters: operation
        });

        agent.add(speech);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('fallback', fallback);
    intentMap.set('reply', reply);
    intentMap.set('start_game', welcome);

    agent.handleRequest(intentMap);
});
