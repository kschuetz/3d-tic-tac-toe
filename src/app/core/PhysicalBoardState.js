
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

const Immutable = require('Immutable'),
      PhysicalSquareState = require('./PhysicalSquareState');

const defaultSquareState = PhysicalSquareState.defaultState,
      baseSquareMap = Immutable.Map();

function PhysicalBoardState(props) {
    if(false === (this instanceof PhysicalBoardState)) {
        return new PhysicalBoardState(props);
    }

    if(props && props.squares) {
        this._squares = props.squares;
    } else {
        this._squares = baseSquareMap;
    }
}


function checkDimension(x) {
    if(x >= 0 && x <= 3) {
        return x;
    } else {
        throw new Error('dimension out of range: ' + x);
    }
}

function getSquareIndex(plane, row, col) {
    return 16 * checkDimension(plane) + 4 * checkDimension(row) + checkDimension(col);
}

PhysicalBoardState.prototype.withNewSquares = function(squares) {
    return new PhysicalBoardState({ squares });
};

PhysicalBoardState.prototype.getSquare = function(plane, row, col) {
    let index = getSquareIndex(plane, row, col),
        square = this._squares.get(index);

    if(!square) {
        return defaultSquareState;
    } else {
        return square;
    }
};

PhysicalBoardState.prototype.updateSquare = function(plane, row, col, f) {
    let index = getSquareIndex(plane, row, col),
        square = this._squares.get(index);

    if(!square) {
        let newSquare = f(defaultSquareState);
        if(newSquare && !Immutable.is(newSquare, defaultSquareState)) {
            return this.withNewSquares(this._squares.set(index, newSquare));
        } else {
            return this;
        }
    } else {
        let newSquare = f(square);
        if(newSquare) {
            if(Immutable.is(newSquare, defaultSquareState)) {
                return this.withNewSquares(this._squares.remove(index));
            } else if(Immutable.is(newSquare, square)) {
                return this;
            } else {
                return this.withNewSquares(this._squares.set(index, newSquare));
            }
        } else {
            return this.withNewSquares(this._squares.remove(index));
        }
    }

};

PhysicalBoardState.readFromString = function(s) {
    let len = (s && s.length) || 0;
    if(len > 64) {
        len = 64;
    }
    let squares = baseSquareMap;
    for(let i = 0; i < len; i += 1) {
        let c = s.charAt(i);
        if(c === 'x' || c === 'X') {
            squares = squares.set(i, PhysicalSquareState.xPiece);
        } else if (c === 'o' || c === 'O') {
            squares = squares.set(i, PhysicalSquareState.oPiece);
        }
    }
    return new PhysicalBoardState({ squares });
};

PhysicalBoardState.prototype.writeToString = function() {
    let result = [];
    for(let i = 0; i < 64; i += 1) {
        let square = this._squares.get(i),
            pieceType = (square || defaultSquareState).pieceType;

        if(pieceType === 1) {
            result.push('x');
        } else if (pieceType === 2) {
            result.push('o');
        } else {
            result.push('.');
        }
    }

    return result.join('');
};


PhysicalBoardState.emptyBoard = new PhysicalBoardState();

module.exports = PhysicalBoardState;