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

import Immutable from "Immutable";
import {Solution} from "./Solution";

function SolutionMap() {

}


// this is used heavily when evaluating the board so it should be fast
SolutionMap.prototype.getSolutionsForSquare = function (squareIndex) {
    return this._squares[squareIndex];
};


// this is only used in the UI so it does not need to be fast
SolutionMap.prototype.getSquaresForSolution = function (solutionIndex) {
    let solution = this._solutions.get(solutionIndex);
    return solution.squares;
};

Object.defineProperty(SolutionMap.prototype, 'solutions', {
    get() {
        return this._solutions;
    },
    enumerable: true
});

Object.defineProperty(SolutionMap.prototype, 'solutionCount', {
    get() {
        return this._solutions.size;
    },
    enumerable: true
});


function buildSolutionMap() {
    let squaresToSolutions = [],//squaresToSolutions = new Map(), //squaresToSolutions = Immutable.Map(),
        solutions = Immutable.List(),
        solutionIndex = 0;

    for (let i = 0; i < 64; i += 1) {
        squaresToSolutions[i] = [];
    }

    function addSolutionToSquare(squareIndex, solutionIndex) {
        let item = squaresToSolutions[squareIndex]; //squaresToSolutions.get(squareIndex);
        item.push(solutionIndex);
    }

    function addSolution(a, b, c, d) {
        let solution = new Solution(a, b, c, d);
        solutions = solutions.push(solution);
        addSolutionToSquare(a, solutionIndex);
        addSolutionToSquare(b, solutionIndex);
        addSolutionToSquare(c, solutionIndex);
        addSolutionToSquare(d, solutionIndex);
        solutionIndex += 1;
    }

    function addGroup(a, di) {
        let b = a + di,
            c = b + di,
            d = c + di;

        addSolution(a, b, c, d);
    }

    for (let i = 0; i < 4; i += 1) {
        let plane = i * 16;
        for (let j = 0; j < 4; j += 1) {
            addGroup(plane + 4 * j, 1);  // x
            addGroup(plane + j, 4);      // y
            addGroup(4 * i + j, 16);    // z
        }
        addGroup(plane, 5);              // x, y
        addGroup(plane + 3, 3);          // x, y

        addGroup(4 * i, 17);              // x, z
        addGroup(4 * i + 3, 15);          // x, z

        addGroup(i, 20);              // y, z
        addGroup(12 + i, 12);         // y, z
    }

    // x, y, z
    addGroup(0, 21);
    addGroup(3, 19);
    addGroup(12, 13);
    addGroup(15, 11);

    Object.freeze(squaresToSolutions);

    let result = new SolutionMap();
    result._solutions = solutions;
    result._squares = squaresToSolutions;
    return result;
}

export const solutionMap = buildSolutionMap();
