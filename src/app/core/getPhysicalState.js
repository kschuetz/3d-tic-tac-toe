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
    PhysicalBoardState = require('./PhysicalBoardState'),
    PhysicalSquareState = require('./PhysicalSquareState'),
    AnimStates = require('./AnimStates');

/**
 * Derives a PhysicalBoardState from a GameState
 * @param gameState
 */
function getPhysicalState(props, gameState) {
    let humanCanMove = props && props.humanCanMove,
        lastMove = props.lastMove || -1,
        winningSquares = gameState.getWinningSquares();

    let emptySquare = humanCanMove ? PhysicalSquareState.clickableEmpty : PhysicalSquareState.nonClickableEmpty;

    let squareMap = PhysicalBoardState.baseSquareMap;

    for(let squareIndex = 0; squareIndex < 64; squareIndex += 1) {
        let piece = gameState.getPlayerAt(squareIndex),
            physicalPiece;
        if(piece) {
            physicalPiece = PhysicalSquareState.playerPiece(piece);

            if(winningSquares.has(squareIndex)) {
                physicalPiece = physicalPiece.set('animState', AnimStates.FLASHING);
            } else if (squareIndex === lastMove) {
                physicalPiece = physicalPiece.set('animState', AnimStates.HIGHLIGHTED);
            }

        } else {
            physicalPiece = emptySquare;
        }

        squareMap = squareMap.set(squareIndex, physicalPiece);
    }

    return new PhysicalBoardState({ squares: squareMap });
}


module.exports = getPhysicalState;