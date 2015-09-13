/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Kevin Schuetz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const
    _ = require('lodash'),
    Immutable = require('Immutable'),
    GameState = require('./GameState'),
    phaseCodes = require('./phaseCodes'),
    players = require('./players');


const MetaGameState = Immutable.Record({
    gameState:     GameState.defaultGameState,
    phase:         phaseCodes.INIT,
    lastMove:      -1,
    playerTurn:    players.X
});


Object.defineProperty(MetaGameState.prototype, 'isThinking', {
    get() {
        return this.phase === phaseCodes.THINKING;
    },
    enumerable: true
});

Object.defineProperty(MetaGameState.prototype, 'isWaitingForHuman', {
    get() {
        return this.phase === phaseCodes.WAITING_FOR_HUMAN;
    },
    enumerable: true
});

Object.defineProperty(MetaGameState.prototype, 'isGameOver', {
    get() {
        return this.phase === phaseCodes.GAME_OVER;
    },
    enumerable: true
});

Object.defineProperty(MetaGameState.prototype, 'isGameStarted', {
    get() {
        return this.phase !== phaseCodes.INIT;
    },
    enumerable: true
});

module.exports = MetaGameState;