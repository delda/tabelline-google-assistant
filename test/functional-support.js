'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - support', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({textToSpeech, suggestions}) => {
            expect(textToSpeech[0]).to.have.string('Ciao! ');
            const splitText = textToSpeech[0].split('Ciao! ');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            return action.send('cosa sai fare?');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('Vuoi provarci?');
            return action.send('no');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('prossima!');
        })
});
