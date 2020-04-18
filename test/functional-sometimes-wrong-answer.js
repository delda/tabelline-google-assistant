'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - sometimes a wrong answer', action => {
    action.locale = 'it-IT';
    let oldResult = 0;
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Ciao! ');
            const splitText = textToSpeech[0].split('Ciao! ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            let result = multiplier * multiplicand;
            oldResult = result;
            result++;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('No, prova ancora');
            const splitText = textToSpeech[0].split('No, prova ancora. ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            expect(result).to.be.eq(oldResult);
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            let result = multiplier * multiplicand;
            oldResult = result;
            result++;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('No, prova ancora');
            const splitText = textToSpeech[0].split('No, prova ancora. ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            let result = multiplier * multiplicand;
            expect(result).to.be.eq(oldResult);
            result++;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('No: ');
            const splitText = textToSpeech[0].split('No: ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            expect(result).to.not.be.eq(oldResult);
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send(result.toString());
        });
});
