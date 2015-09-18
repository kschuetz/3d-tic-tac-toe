

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

const _ = require('lodash');


function generate(target, xs, ys, zs) {
    for(let xi = 0; xi < 2; xi += 1) {
        let x = xs[xi];
        for(let yi = 0; yi < 2; yi += 1) {
            let y = ys[yi];
            for(let zi = 0; zi < 2; zi += 1) {
                let z = zs[zi];
                target.push(16 * z + 4 * y + x);
            }
        }
    }
}

const
    outer = [0, 3],
    inner = [1, 2];

const major = (function() {
    let result = [];
    generate(result, inner, inner, inner);
    generate(result, outer, outer, outer);
    return result;
})();

const minor = (function() {
    let result = [];
    generate(result, inner, inner, outer);
    generate(result, inner, outer, inner);
    generate(result, outer, inner, inner);

    generate(result, outer, outer, inner);
    generate(result, outer, inner, outer);
    generate(result, inner, outer, outer);
    return result;
})();


console.log(major);
console.log(minor);

function generateSquarePreferences() {
    let majorShuffled = _.shuffle(major),
        minorShuffled = _.shuffle(minor),
        combined = majorShuffled.concat(minorShuffled);


    return combined;
}



module.exports = generateSquarePreferences;