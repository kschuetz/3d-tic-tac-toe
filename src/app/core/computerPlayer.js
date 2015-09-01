

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
    generateSquarePreferences = require('./generateSquarePreferences'),
    PrincipalVariation = require('./PrincipalVariation'),
    MoveComputation = require('./MoveComputation'),
    GameState = require('./GameState'),
    Ply = require('./Ply'),
    MoveResponse = require('./MoveResponse');


const defaultStepsPerTick = 20000;




function ComputerPlayer(props) {
    this.stepsPerTick = props.stepsPerTick || defaultStepsPerTick;
    this.playerIndex = props.playerIndex || -1;
    this.squarePrefs = generateSquarePreferences();
    //this.level = props.level || 1;
}


ComputerPlayer.prototype.makeMove = function(gameState, asPlayer) {
    let self = this,
        interrupted = false,
        startTime = new Date().getTime();

    asPlayer = asPlayer || this.playerIndex;

    let p = new Promise((resolve, reject) => {

        function deliverMove(square) {
            let endTime = new Date().getTime(),
                response = new MoveResponse({
                    square,
                    timeTaken:  endTime - startTime,
                    interrupted
                });
            resolve(response);
        }

        let occupied = gameState.getOccupiedSquareCount();
        if(occupied < 1) {
            // first move just picks a random of the strongest squares
            deliverMove(self.squarePrefs[0]);
            return;
        }

        let maxDepth;
        if(occupied < 4) {
            maxDepth = 3;
        } else if(occupied < 8) {
            maxDepth = 4;
        } else if(occupied < 32) {
            maxDepth = 5;
        } else {
            maxDepth = 6;
        }

        let computation = new MoveComputation({
            plyClass:  Ply,
            maxDepth,
            player:   asPlayer,
            gameState,
            squarePrefs:  this.squarePrefs
        });

        let step = function() {
            computation.execute(self.stepsPerTick);
            if(interrupted) {
                computation.done = true;
            }
            if(computation.done) {
                let bestMove = computation.getBestMove();
                deliverMove(bestMove);
            } else {
                setTimeout(step, 5);
            }
        };

        step();
    });

    return {
        interrupt:  function() {
            interrupted = true;
        },

        result:  p
    };
};




function transposeSquarePrefs(squarePrefs) {
    let result = new Array(64);
    for(let i = 0; i < 64; i += 1) {
        result[squarePrefs[i]] = 64 - i;
    }
    return result;
}

function test1() {
    console.log('creating machine');

    let baseSquarePrefs = generateSquarePreferences(),
        squarePrefsTransposed = transposeSquarePrefs(baseSquarePrefs);

    let squarePrefs = baseSquarePrefs;
    //let squarePrefs = squarePrefsTransposed;

    let startState = GameState.defaultGameState.placePiece(21, 1).placePiece(25, -1).placePiece(48, 1);

    console.log(startState.getOccupiedSquares());

    let foo = new MoveComputation({
        plyClass:  Ply,
        maxDepth: 4,
        player:   1,
        gameState:  startState,
        squarePrefs
    });

    console.log('machine created');

    let startTime = new Date().getTime();


    let step = function() {
        console.log('executing...');
        foo.execute(50000);
        if(foo.done) {
            let endTime = new Date().getTime();
            console.log(foo);
            console.log('time: ', endTime - startTime);
        } else {
            setTimeout(step);
        }
    };

    step();
}

function test2() {
    let player1 = new ComputerPlayer({ playerIndex: 1}),
        player2 = new ComputerPlayer({ playerIndex: -1});


    function printGameState(gameState) {
        console.log(gameState.contents.getDebugString());
        if(gameState.gameOver) {
            let winningSquares = gameState.getWinningSquares();
            console.log(winningSquares.toJS());
        }
    }

    function turn(xToMove, state) {
        let player = xToMove ? player1 : player2;
        console.log(player);
        if(state.gameOver) {
            console.log('game over');
            printGameState(state);
            return;
        }

        player.makeMove(state).result.then(resp => {
            console.log(resp);
            let newState = state.placePiece(resp.square, player.playerIndex);
            printGameState(newState);

            setTimeout(() => {
                turn(!xToMove, newState);
            });
        });
    }

    turn(true, GameState.defaultGameState);
}


module.exports = {
    test1,
    test2
};
