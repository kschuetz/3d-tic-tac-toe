
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

/*jshint bitwise: false*/


const
    Immutable = require('Immutable'),
    solutionMap = require('./solutionMap'),
    solutionStates = require('./solutionStates'),
    BoardContents = require('./BoardContents');


const
    baseSolutionScores = Immutable.List(Immutable.Repeat(solutionStates.empty, solutionMap.solutionCount)),
    baseBoardScore = solutionMap.solutionCount * solutionStates.emptyValue;

const
    balanceUs = [0, 1, -1],
    balanceThem = [0, -1, 1],
    oppositeOf = [0, 2, 1];

function GameState(props) {
    this.balance = props.balance;
    this.solutionScores = props.solutionScores;
    this.winner = props.winner;
    this.gameOver = props.winner > 0;

    this.contents = props.contents || BoardContents.emptyBoard;
}


GameState.prototype.placePiece = function(squareIndex, player) {
    let solutionsForSquare = solutionMap.getSolutionsForSquare(squareIndex),
        balance = this.balance,
        opponent = -player,
        solutionScores = this.solutionScores,
        winner = this.winner,
        contents = this.contents.setPlayerAt(squareIndex, player);

    let solutionCount = solutionsForSquare.length;
    for(let i = 0; i < solutionCount; i += 1) {
        let solutionIndex = solutionsForSquare[i],
            targetState = solutionScores.get(solutionIndex);

        balance -= player * targetState.score(player);
        balance -= opponent * targetState.score(opponent);

        let newState = targetState.play(player);

        balance += player * newState.score(player);
        balance += opponent * newState.score(opponent);

        if(newState.isWinFor(player)) {
            winner = player;
        }

        solutionScores = solutionScores.set(solutionIndex, newState);
    }

    return new GameState({
        contents,
        solutionScores,
        balance,
        winner
    });
};

GameState.prototype.isSquareOccupied = function(squareIndex) {
    return !this.contents.isSquareEmpty(squareIndex);
};

GameState.prototype.isSquareEmpty = function(squareIndex) {
    return this.contents.isSquareEmpty(squareIndex);
};

GameState.prototype.isLegalMove = GameState.prototype.isSquareEmpty;

GameState.prototype.getPlayerAt = function(squareIndex) {
    return this.contents.getPlayerAt(squareIndex);
};

GameState.prototype.getOccupiedSquareCount = function() {
    return this.contents.getOccupiedSquareCount();
};

GameState.prototype.getOccupiedSquares = function() {
    let result = [];
    for(let i = 0; i < 64; i += 1) {
        if(!this.contents.isSquareEmpty(i)) {
            result.push(i);
        }
    }
    return result;
};

GameState.prototype.getWinningSquares = function() {
    if(this._winningSquares) {
        return this._winningSquares;
    }
    let result = Immutable.Set();
    this.solutionScores.forEach((ss, solutionIndex) => {
        if(ss.isWin) {
            let solution = solutionMap.solutions.get(solutionIndex),
                squares = solution.squares;
            squares.forEach(s => result = result.add(s));
        }
    });
    this._winningSquares = result;
    return result;
};


const baseGameState = new GameState({
    contents:        BoardContents.emptyBoard,
    solutionScores:  baseSolutionScores,
    balance:       0,
    winner:        0
});


GameState.defaultGameState = baseGameState;

module.exports = GameState;