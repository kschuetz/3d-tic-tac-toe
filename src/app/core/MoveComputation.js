
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
    PrincipalVariation = require('./PrincipalVariation');


function MoveComputation(props) {
    this.plyClass = props.plyClass;

    this.maxDepth = props.maxDepth || 4;
    this.gameState = props.gameState;
    this.player = props.player;

    this.favoriteSquares = props.favoriteSquares;

    this.pv = new PrincipalVariation(this.maxDepth);
    this.iteration = 0;
    this.stack = null;
    this.done = false;

    this.alphaCutoffCount = 0;
    this.betaCutoffCount = 0;
}


MoveComputation.prototype.getBestMove = function() {
    return this.pv.getBestMove();
};

MoveComputation.prototype.answer = function() {
    return null;
};

MoveComputation.prototype.process = function() {
    if(this.done) {
        return true;
    }

    let Ply = this.plyClass;

    if(!this.stack) {
        if(this.iteration < this.maxDepth) {
            this.iteration += 1;

            this.stack = new Ply({
                root:    true,
                player:  this.player,
                host: this,
                gameState:  this.gameState,
                depth:  this.iteration - 1
            });

        } else {
            this.done = true;
            return true;
        }
    }

    this.stack = this.stack.process();

    return this.done;
};


MoveComputation.prototype.execute = function(steps) {
    steps = steps || 1;
    while(steps > 0 && !this.done) {
        this.process();
        steps -= 1;
    }

    return this.done;
};

module.exports = MoveComputation;