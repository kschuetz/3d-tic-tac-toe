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
    GameState = require('./GameState');

function Game(props) {
    this.player1 = props.player1;
    this.player2 = props.player2;
    this.onStateChange = props.onStateChange;
}


Game.prototype.loop = function() {
    const player1 = this.player1,
          player2 = this.player2,
          onStateChange = this.onStateChange || _.noop;
    function turn(xToMove, state) {
        onStateChange(state);

        let player = xToMove ? player1 : player2;

        if(state.gameOver) {
            return;
        }

        player.makeMove(state).result.then(resp => {
            let newState = state.placePiece(resp.square, player.playerIndex);

            setTimeout(() => {
                turn(!xToMove, newState);
            });
        });
    }

    turn(false, GameState.defaultGameState);

};

module.exports = Game;