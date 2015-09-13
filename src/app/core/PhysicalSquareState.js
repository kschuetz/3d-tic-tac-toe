
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

const Immutable = require('Immutable');


const PhysicalSquareState = Immutable.Record({
    pieceType: 0,       // 0, 1, or -1
    clickable: true,
    animState: null,
    animPhaseOffset: 0        // 0 .. 1
});

Object.defineProperty(PhysicalSquareState.prototype, 'isXPiece', {
    get() {
        return this.pieceType > 0;
    },
    enumerable: true
});

Object.defineProperty(PhysicalSquareState.prototype, 'isOPiece', {
    get() {
        return this.pieceType < 0;
    },
    enumerable: true
});

Object.defineProperty(PhysicalSquareState.prototype, 'isOccupied', {
    get() {
        return this.pieceType !== 0;
    },
    enumerable: true
});

const defaultState = new PhysicalSquareState();

PhysicalSquareState.defaultState = defaultState;
PhysicalSquareState.clickableEmpty = defaultState;
PhysicalSquareState.nonClickableEmpty = defaultState.set('clickable', false);


PhysicalSquareState.xPiece = new PhysicalSquareState({
    pieceType:  1,
    clickable:  false
});

PhysicalSquareState.oPiece = new PhysicalSquareState({
    pieceType:  -1,
    clickable:  false
});

PhysicalSquareState.playerPiece = function(playerIndex) {
    if(playerIndex > 0) {
        return PhysicalSquareState.xPiece;
    } else if (playerIndex < 0) {
        return PhysicalSquareState.oPiece;
    } else {
        return PhysicalSquareState.defaultState;
    }
};

module.exports = PhysicalSquareState;