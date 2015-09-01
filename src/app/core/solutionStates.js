
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
    players = require('./players');


const
    winValue = 10000,
    threeValue = 12,
    twoValue = 5,
    oneValue = 2,
    emptyValue = 1,
    stalemateValue = 0;

const stalemate = {
    play() {
        return this;
    },

    score() {
        return stalemateValue;
    },

    isWinFor() {
        return false;
    },

    canWin() {
        return false;
    },

    isWin:  false
};

function isThisPlayer(playerIndex) {
    return this.playerIndex === playerIndex;
}

function Win(playerIndex) {
    this.playerIndex = playerIndex;
}

Win.prototype.play = function() {
    return this;
};

Win.prototype.score = function(playerIndex) {
    return playerIndex === this.playerIndex ? winValue : 0;
};

Win.prototype.isWinFor = isThisPlayer;
Win.prototype.canWin = isThisPlayer;
Win.prototype.isWin = true;

function Combo(playerIndex, score, nextState) {
    this.playerIndex = playerIndex;
    this._score = score;
    this.nextState = nextState;
}

Combo.prototype.play = function(playerIndex) {
    if(playerIndex === this.playerIndex) {
        return this.nextState;
    } else {
        return stalemate;
    }
};

Combo.prototype.score = function(playerIndex) {
    return playerIndex === this.playerIndex ? this._score : 0;
};

Combo.prototype.isWinFor = function() {
    return false;
};

Combo.prototype.isWin = false;
Combo.prototype.canWin = isThisPlayer;

const
    xWin = new Win(players.X),
    x3 = new Combo(players.X, threeValue, xWin),
    x2 = new Combo(players.X, twoValue, x3),
    x1 = new Combo(players.X, oneValue, x2),
    oWin = new Win(players.O),
    o3 = new Combo(players.O, threeValue, oWin),
    o2 = new Combo(players.O, twoValue, o3),
    o1 = new Combo(players.O, oneValue, o2);

const empty = {
    play(playerIndex) {
        if(playerIndex === players.X) {
            return x1;
        } else {
            return o1;
        }
    },

    score() {
        return emptyValue;
    },

    isWinFor() {
        return false;
    },

    canWin() {
        return true;
    },

    isWin:   false
};


module.exports = {
    empty,
    x1,
    x2,
    x3,
    xWin,
    o1,
    o2,
    o3,
    oWin,
    stalemate,
    emptyValue
};