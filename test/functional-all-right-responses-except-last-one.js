'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - all right responses except last one', action => {
    action.locale = 'it-IT';
    let multiplications = Array.from({ length:10 }, () => (Array.from({ length:10 }, () => null)));
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Ciao!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand + 1;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('No, prova ancora');
            const splitText = textToSpeech[0].split('No, prova ancora. ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand + 1;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('No: ');
            let splitText = textToSpeech[0].split('No: ');
            let [multiplier, multiplicand, rightResult] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            expect(rightResult).to.equal(result.toString());
            expect(textToSpeech[0]).to.have.string('Hai risposto correttamente a');
            splitText = textToSpeech[0].split('Hai risposto correttamente a');
            expect(splitText[1]).to.have.string('domande');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, splitText[1]);
            expect(parseInt(rigthResponses)).to.equal(4);
            expect(parseInt(questions)).to.equal(5);
            expect(splitText[1]).to.have.string('Vuoi continuare?');
            return action.send('no');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Ciao! Alla prossima!');
        });
});

