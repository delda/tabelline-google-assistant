'use strict';

const { ActionsOnGoogleAva } = require('actions-on-google-testing');
const { expect } = require('chai');
const testCredentials = require("./test-credentials.json");
const utils = require('../functions/utils');

const action = new ActionsOnGoogleAva(testCredentials);

action.startTest('sottrazioni - smart questions', action => {
    action.locale = 'it-IT';
    let smartQuestion = 'down';
    let multiplications = Array.from({ length:10 }, () => (Array.from({ length:10 }, () => null)));
    return action.startWith('il gioco delle moltiplicazioni')
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Ciao!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            expect(splitText[1]).to.have.string('Hai risposto correttamente a');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, splitText[1]);
            expect(parseInt(rigthResponses)).to.equal(5);
            expect(parseInt(questions)).to.equal(5);
            expect(splitText[1]).to.have.string('Vuoi continuare?');
            return action.send('sì');
        })
        .then(({ textToSpeech, suggestions }) => {
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            expect(splitText[1]).to.have.string('Hai risposto correttamente a');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, splitText[1]);
            expect(parseInt(rigthResponses)).to.equal(10);
            expect(parseInt(questions)).to.equal(10);
            expect(splitText[1]).to.have.string('Vuoi continuare?');
            return action.send('sì');
        })
        .then(({ textToSpeech, suggestions }) => {
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            expect(splitText[1]).to.have.string('Hai risposto correttamente a');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, splitText[1]);
            expect(parseInt(rigthResponses)).to.equal(15);
            expect(parseInt(questions)).to.equal(15);
            expect(splitText[1]).to.have.string('Vuoi continuare?');
            return action.send('sì');
        })
        .then(({ textToSpeech, suggestions }) => {
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, textToSpeech);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            let [multiplier, multiplicand] = utils.matchAll(/\d+/, splitText[1]);
            const result = multiplier * multiplicand;
            multiplicand = parseInt(multiplicand);
            if (smartQuestion === 'down') {
                expect(multiplicand).to.be.above(-1);
                expect(multiplicand).to.be.below(5);
            } else {
                expect(multiplicand).to.be.above(4);
                expect(multiplicand).to.be.below(10);
            }
            smartQuestion = smartQuestion === 'up' ? 'down' : 'up';
            expect(multiplications[multiplier-1][multiplicand-1]).to.be.null;
            multiplications[multiplier-1][multiplicand-1] = result;
            return action.send(result.toString());
        })
        .then(({ textToSpeech, suggestions }) => {
            const splitText = textToSpeech[0].split('Bravo!');
            expect(splitText[1]).to.have.string('Hai risposto correttamente a');
            let [rigthResponses, questions] = utils.matchAll(/\d+/, splitText[1]);
            expect(parseInt(rigthResponses)).to.equal(20);
            expect(parseInt(questions)).to.equal(20);
            expect(splitText[1]).to.have.string('Vuoi continuare?');
            return action.send('no');
        });
});
