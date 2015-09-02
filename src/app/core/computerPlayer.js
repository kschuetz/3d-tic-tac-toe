

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





module.exports = ComputerPlayer;
