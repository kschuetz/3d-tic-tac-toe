
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


const _ = require('lodash');

function BoardContents(data) {
    this.data = data || new Int32Array(4);
}

BoardContents.prototype.getPlayerAt = function(squareIndex) {
    let occ = squareIndex < 32 ? this.data[0] : this.data[1],
        bit = squareIndex < 32 ? squareIndex : squareIndex - 32,
        x = (occ >>> bit) & 1;

    if(!x) {
        return 0;   // no player
    }

    let p = squareIndex < 32 ? this.data[2] : this.data[3];

    x = (p >>> bit) & 1;

    if(x) {
        return 1;
    } else {
        return -1;
    }
};

BoardContents.prototype.setPlayerAt = function(squareIndex, player) {
    let data = this.data;
    if(squareIndex < 32) {
        let occ = data[0],
            p = data[2],
            bit = squareIndex,
            mask = (1 << bit);

        occ = occ | mask;

        if(player > 0) {
            p = p | mask;
        } else {
            p = p & (~mask);
        }

        let newData = new Int32Array(4); //[occ, data[1], p, data[3]];
        newData[0] = occ;
        newData[1] = data[1];
        newData[2] = p;
        newData[3] = data[3];

        return new BoardContents(newData);

    } else {
        let occ = data[1],
            p = data[3],
            bit = squareIndex - 32,
            mask = (1 << bit);

        occ = occ | mask;

        if(player > 0) {
            p = p | mask;
        } else {
            p = p & (~mask);
        }

        //let newData = [data[0], occ, data[2], p];

        let newData = new Int32Array(4); //[occ, data[1], p, data[3]];
        newData[0] = data[0];
        newData[1] = occ;
        newData[2] = data[2];
        newData[3] = p;

        return new BoardContents(newData);
    }

};

BoardContents.prototype.isSquareEmpty = function(squareIndex) {
    let occ = squareIndex < 32 ? this.data[0] : this.data[1],
        bit = squareIndex < 32 ? squareIndex : squareIndex - 32,
        x = (occ >>> bit) & 1;

    return !x;
};

BoardContents.prototype.getOccupiedSquareCount = function() {
    let result = 0,
        a = this.data[0],
        b = this.data[1];
    for(let i = 0; i < 32; i += 1) {
        result += (a & 1) + (b & 1);
        a = a >>> 1;
        b = b >>> 1;
    }
    return result;
};

BoardContents.prototype.getDebugString = function() {
    let contents = [];
    for(let i = 0; i < 64; i += 1) {
        let p = this.getPlayerAt(i);
        if(p > 0) {
            contents.push('x');
        } else if (p < 0) {
            contents.push('o');
        } else {
            contents.push('-');
        }
    }
    return contents.join('');
};


BoardContents.emptyBoard = new BoardContents();

BoardContents.readFromString = function(s) {
    let result = new BoardContents(),
        len = (s && s.length) || 0;
    if(len > 64) {
        len = 64;
    }
    for(let i = 0; i < len; i += 1) {
        let c = s.charAt(i);
        if(c === 'x' || c === 'X') {
            result = result.setPlayerAt(i, 1);
        } else if (c === 'o' || c === 'O') {
            result = result.setPlayerAt(i, -1);
        }
    }

    return result;
};

BoardContents.generateRandom = function(turnsTaken) {
    let turns = _.shuffle(_.range(0, 63)),
        result = new BoardContents();
    if(turnsTaken > 32) {
        turnsTaken = 32;
    }
    let player = 1,
        i = 0;
    while(turnsTaken > 0) {
        result = result.setPlayerAt(turns[i], player);
        turnsTaken -= 1;
        i += 1;
        player = -player;
    }

    return result;

};

module.exports = BoardContents;