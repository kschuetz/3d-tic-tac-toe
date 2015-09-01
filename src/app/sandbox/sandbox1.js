
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
    React = require('react'),
    _ = require('lodash'),
    Immutable = require('Immutable');

const
    XPiece = require('../components/XPiece.react'),
    OPiece = require('../components/OPiece.react'),
    Plane = require('../components/Plane.react'),
    GameBoard = require('../components/GameBoard.react'),
    PhysicalBoardState = require('../core/PhysicalBoardState'),
    solutionMap = require('../core/solutionMap'),
    GameState = require('../core/GameState'),
    computerPlayer = require('../core/computerPlayer'),
    generateSquarePreferences = require('../core/generateSquarePreferences'),
    BoardContents = require('../core/BoardContents');


function printInfo() {
    for(let z = 0; z < 4; z += 1) {
        for(let y = 0; y < 4; y += 1) {
            for(let x = 0; x < 4; x += 1) {
                let squareIndex = 16 * z + 4 * y + x,
                    solutions = solutionMap.getSolutionsForSquare(squareIndex);

                console.log(`${z}:${y}:${x}: ${solutions.size}`);
            }
        }
    }

    //console.log(solutionMap._squaresByValue.toJS());
}


function boardContentsTest() {
    let b = new BoardContents();

    b = b.setPlayerAt(22, 1)
         .setPlayerAt(23, -1)
         .setPlayerAt(0, 1)
         .setPlayerAt(63, -1);

    console.log(b.getDebugString());

    console.log(b.getOccupiedSquareCount());
}


function test1() {
    let state = GameState.defaultGameState;

    state = state.placePiece(21, 1);
    console.log(state);
    state = state.placePiece(22, 2);
    console.log(state);

    state = state.placePiece(16, 1);
    console.log(state);

    state = state.placePiece(26, 1);
    console.log(state);

    state = state.placePiece(31, 1);
    console.log(state);
}


function runSandbox() {
    console.log('in sandbox 1');

    //printInfo();
    //test1();

    const target = document.getElementById('sandbox-container');


    const testBoardState1 = PhysicalBoardState.readFromString('xo..xxooxox..xx.xx.oooo.xo..o.o.ooxo.oxo.oo..x.xx.xxx.xx.xoxx.x.');

    const xPiece = React.createElement(XPiece, { transform: 'skewX(-30)'}),
          oPiece = React.createElement(OPiece, { transform: 'translate(1.5,0),skewX(-30)'}),
          plane = React.createElement(Plane, { transform: 'skewX(0)'}),
          board1 = React.createElement(GameBoard, {
              skew: -30,
              boardState:  testBoardState1,
              onClickSquare:  data => {
                  console.log('square clicked:');
                  console.log(data);
              }
          });

    const backdrop = React.DOM.rect({
        className: 'backdrop',
        x:0,
        y:0,
        width: 100000,
        height: 100000
    });

    const gameScene = React.createElement('g', {
        transform: 'translate(400,600),scale(40)'
    }, board1); //. xPiece, oPiece);

    const scene = React.DOM.g(null, backdrop, gameScene);

    //React.render(scene, target);


    boardContentsTest();

    //computerPlayer.test1();

    computerPlayer.test2();
}











module.exports = runSandbox;