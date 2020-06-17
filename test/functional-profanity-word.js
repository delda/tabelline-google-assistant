'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - use profanity words', action => {
    action.locale = 'it-IT';
    let oldResult = 0;
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({textToSpeech, suggestions}) => {
            expect(textToSpeech[0]).to.have.string('Ciao! ');
            const splitText = textToSpeech[0].split('Ciao! ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            oldResult = result + multiplier + multiplicand;
            return action.send('scemo');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Quanto fa');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech[0]);
            let result = multiplier * multiplicand;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            let result = multiplier * multiplicand;
            return action.send('scemo');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Hai risposto correttamente a');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, textToSpeech[0]);
            expect(parseInt(rigthResponses)).to.equal(1);
            expect(parseInt(questions)).to.equal(2);
        })
});
