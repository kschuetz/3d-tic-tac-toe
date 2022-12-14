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

import React from "react";

import {XPiece} from '../components/XPiece.react';
import {OPiece} from '../components/OPiece.react';
import {Plane} from '../components/Plane.react';
import {GameBoard} from '../components/GameBoard.react';
import {PhysicalBoardState} from '../core/PhysicalBoardState';
import {solutionMap} from '../core/solutionMap';
import {GameState} from '../core/GameState';
import {ComputerPlayer} from '../core/ComputerPlayer';
import {BoardContents} from '../core/BoardContents';
import {Chrome} from '../components/Chrome.react';
import {SceneFrame} from '../components/SceneFrame.react';
import {SceneFrameProperties} from '../core/SceneFrameProperties';

const computerPlayerTests = (function () {
    function test2() {
        let player1 = new ComputerPlayer({playerIndex: 1}),
            player2 = new ComputerPlayer({playerIndex: -1});


        function printGameState(gameState) {
            console.log(gameState.contents.getDebugString());
            if (gameState.gameOver) {
                let winningSquares = gameState.getWinningSquares();
                console.log(winningSquares.toJS());
            }
        }

        function turn(xToMove, state) {
            let player = xToMove ? player1 : player2;
            console.log(player);
            if (state.gameOver) {
                console.log('game over');
                printGameState(state);
                return;
            }

            player.makeMove(state).result.then(resp => {
                console.log(resp);
                let newState = state.placePiece(resp.square, player.playerIndex);
                printGameState(newState);

                setTimeout(() => {
                    turn(!xToMove, newState);
                });
            });
        }

        turn(true, GameState.defaultGameState);
    }


    return {
        test2
    };

})();


function printInfo() {
    for (let z = 0; z < 4; z += 1) {
        for (let y = 0; y < 4; y += 1) {
            for (let x = 0; x < 4; x += 1) {
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

    const target = document.getElementById('game-container');


    const testBoardState1 = PhysicalBoardState.readFromString('xo..xxooxox..xx.xx.oooo.xo..o.o.ooxo.oxo.oo..x.xx.xxx.xx.xoxx.x.');

    const xPiece = React.createElement(XPiece, {transform: 'skewX(-30)'}),
        oPiece = React.createElement(OPiece, {transform: 'translate(1.5,0),skewX(-30)'}),
        plane = React.createElement(Plane, {transform: 'skewX(0)'}),
        board1 = React.createElement(GameBoard, {
            skew: -30,
            boardState: testBoardState1,
            onClickSquare: data => {
                console.log('square clicked:');
                console.log(data);
            }
        });

    const backdrop = React.DOM.rect({
        className: 'backdrop',
        x: 0,
        y: 0,
        width: 100000,
        height: 100000
    });

    const gameScene = React.createElement('g', {
        transform: 'translate(400,600),scale(40)'
    }, board1); //. xPiece, oPiece);

    let chrome = React.createElement(Chrome, {
        transform: 'translate(690,400)'
    });

    let sceneFrameProperties = SceneFrameProperties.defaultProperties;

    let sceneFrame1 = React.createElement(SceneFrame, {
        sceneFrameProperties,
        boardState: testBoardState1,
        onClickSquare: data => {
            console.log('square clicked:');
            console.log(data);
        }
    });

    React.render(sceneFrame1, target);

    //const scene = React.DOM.g(null, backdrop, gameScene, chrome);
    //
    //React.render(scene, target);
    //
    //boardContentsTest();
    //
    ////computerPlayer.test1();

    computerPlayerTests.test2();
}

export {runSandbox};
