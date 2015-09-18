

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


const
    defaultStepsPerTick = 20000,
    defaultDelayBetweenTicks = 1;       // higher is slower but gives the browser more breathing room




function ComputerPlayer(props) {
    this.stepsPerTick = props.stepsPerTick || defaultStepsPerTick;
    this.playerIndex = props.playerIndex || -1;
    if(_.isUndefined(props.delayBetweenTicks)) {
        this.delayBetweenTicks = defaultDelayBetweenTicks;
    } else {
        this.delayBetweenTicks = props.delayBetweenTicks;
    }
    this.favoriteSquares = generateSquarePreferences();

    let squarePrefs = new Array(64);
    for(let i = 0; i < 64; i += 1) {
        let square = this.favoriteSquares[i];
        squarePrefs[square] = 64 - i;
    }

    this.squarePrefs = squarePrefs;

    console.log(this.favoriteSquares);
    console.log(this.squarePrefs);

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
            deliverMove(self.favoriteSquares[0]);
            return;
        }

        let maxDepth;
        if(occupied < 8) {
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

                console.log('pv:');
                console.log(computation.pv.debugGetLine());

                deliverMove(bestMove);
            } else {
                setTimeout(step, self.delayBetweenTicks);
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


ComputerPlayer.prototype.isComputerPlayer = true;


module.exports = ComputerPlayer;
