
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

function PrincipalVariation(depth) {
    this.depth = depth;

    let size = (depth * depth);

    let line = new Array(size);
    for(let i = 0; i < size; i += 1) {
        line[i] = -1;
    }

    this.line = line;
}


PrincipalVariation.prototype.getBestMove = function(ply) {
    ply = ply || 0;
    return this.line[ply];
};

PrincipalVariation.prototype.updateBestMove = function(ply, value) {
    let baseIndex = ply * this.depth;
    this.line[baseIndex] = value;
    if(ply < this.depth - 1) {
        let dest = baseIndex + 1,
            source = baseIndex + this.depth,
            copyCount = this.depth - ply - 1;

        while(copyCount > 0) {
            this.line[dest] = this.line[source];
            source += 1;
            dest += 1;
            copyCount -= 1;
        }
    }
};

PrincipalVariation.prototype.debugGetLine = function() {
    return this.line.slice(0, this.depth);
};

module.exports = PrincipalVariation;