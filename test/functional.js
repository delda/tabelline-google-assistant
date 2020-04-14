'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

// Start out with giving a name to this test
action.startTest('sottrazioni - welcome', action => {
    action.locale = 'it-IT';
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({ textToSpeech, suggestions }) => {
            expect(textToSpeech).to.be.an('array');
            expect(textToSpeech).to.have.lengthOf(1);
            expect(textToSpeech).to.not.be.empty;
            const splitText = textToSpeech[0].split('Ciao!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;

            return action.send(result.toString());
        })
        .then(({ textToSpeech }) => {
            expect(textToSpeech[0]).to.have.string('Bravo!');
            expect(textToSpeech[0]).to.have.string('Quanto fa');
        });
});

action.startTest('sottrazioni - smart questions', action => {
    action.locale = 'it-IT';
    let smartQuestion = 'down';
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Ciao!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(0);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            return action.send(result.toString());
        })
        .then(({ textToSpeech }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(0);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            return action.send(result.toString());
        })
        .then(({ textToSpeech }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(0);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            return action.send(result.toString());
        })
        .then(({ textToSpeech }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(0);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            return action.send(result.toString());
        });
});
