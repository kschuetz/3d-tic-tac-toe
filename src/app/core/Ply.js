
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

const MoveCandidate = require('./MoveCandidate');

function generateMoves(gameState, squarePrefs, player, pvMove) {
    let result = [],
        len = squarePrefs.length;

    //pvMove = -1;

    if(pvMove >= 0 && gameState.isSquareEmpty(pvMove)) {
        result.push(pvMove);

        for(let i = 0; i < len; i += 1) {
            let square = squarePrefs[i];
            if(square !== pvMove && gameState.isSquareEmpty(square)) {
                result.push(square);
            }
        }
    } else {
        for(let i = 0; i < len; i += 1) {
            let square = squarePrefs[i];
            if(gameState.isSquareEmpty(square)) {
                result.push(square);
            }
        }
    }

    return result;
}


function moveSort1(moveA, moveB) {
    let result = moveB.balance - moveA.balance;
    if(result === 0) {
        result = moveB.preference - moveA.preference;
    }
    return result;
}

function moveSort2(moveA, moveB) {
    let result = moveA.balance - moveB.balance;
    if(result === 0) {
        result = moveB.preference - moveA.preference;
    }
    return result;
}

function generateMovesSorted(gameState, squarePrefs, player, pvMove) {
    let moves = [],
        firstMove = null;

    for(let square = 0; square < 64; square += 1) {
        if(gameState.isSquareEmpty(square)) {
            let state = gameState.placePiece(square, player),
                move = new MoveCandidate({
                    state,
                    square,
                    balance:     state.balance,
                    value:       player * state.balance,
                    preference:  squarePrefs[square]
                });
            if(pvMove === square) {
                firstMove = move;
            } else {
                moves.push(move);
            }
        }
    }

    let moveCount = moves.length,
        best = Number.NEGATIVE_INFINITY,
        bestIndex = -1;

    for(let i = 0; i < moveCount; i += 1) {
        let move = moves[i];
        if(move.value > best) {
            best = move.value;
            bestIndex = i;
        }
    }

    if(bestIndex >= 0) {
        let move = moves[bestIndex];
        moves.splice(bestIndex, 1);
        moves.unshift(move);
    }

    // sort
    let sortFn = player > 0 ? moveSort1 : moveSort2;

    //moves = _.sortBy(moves, sortFn);

    if(firstMove) {
        moves.unshift(firstMove);
    }
    return moves; //.map(m => m.square);

}



function Ply(props) {
    let host = props.host,
        pv = host.pv,
        squarePrefs = host.squarePrefs,
        root = !!props.root,
        left = root || !!props.left;

    this.root = root;
    this.left = left;

    this.player = props.player;
    this.host = host;

    let pvMove = -1;
    if(left) {
        pvMove = pv.getBestMove(props.ply);
    }

    this.depth = props.depth;
    this.gameState = props.gameState;

    if(root) {
        this.moves = generateMovesSorted(props.gameState, squarePrefs, this.player, pvMove);
        //console.log('move sorted:');
        //console.log(this.moves);
    } else {
        this.moves = generateMovesSorted(props.gameState, squarePrefs, this.player, pvMove);
    }

    this.moveCount = this.moves.length;
    this.nextMovePtr = 0;

    if(root) {
        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
        this.parent = host;
        this.ply = 0;
    } else {
        this.alpha = props.alpha;
        this.beta = props.beta;
        this.parent = props.parent;
        this.ply = props.ply;
    }
}


Ply.prototype.process = function() {
    if(this.nextMovePtr >= this.moveCount) {
        return this.parent.answer(this.alpha);
    }

    let candidate = this.moves[this.nextMovePtr],
        move = candidate.square;
    this.lastMove = move;
    this.nextMovePtr += 1;

    let newState = candidate.state; //this.gameState.placePiece(move, this.player);
    if(newState.gameOver || this.depth <= 0) {
        let value = this.player * newState.balance;
        if(value >= this.beta) {

            this.host.betaCutoffCount += 1;

            return this.parent.answer(this.beta);
        }
        if(value > this.alpha) {
            this.alpha = value;

            this.host.alphaCutoffCount += 1;

            this.host.pv.updateBestMove(this.ply, move);
        }

        return this;
    }

    // TODO:  null window search?

    let nextPly = new Ply({
        host: this.host,
        parent:  this,
        gameState:  newState,

        left:   this.left && this.nextMovePtr === 1,
        depth:  this.depth - 1,
        ply:    this.ply + 1,
        player: -this.player,
        alpha:  -this.beta,
        beta:   -this.alpha
    });

    return nextPly.process();
};

Ply.prototype.answer = function(value) {
    value = -value;
    if(value >= this.beta) {
        return this.parent.answer(this.beta);
    }
    if(value > this.alpha) {
        this.alpha = value;

        this.host.pv.updateBestMove(this.ply, this.lastMove);
    }
    return this;
};

module.exports = Ply;



