'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - end game', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({textToSpeech, suggestions}) => {
            expect(textToSpeech[0]).to.have.string('Ciao! ');
            return action.send('zitto');
        })
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech[0]).to.have.string('prossima!');
        })
});
