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

const _ = require('lodash'),
      React = require('react'),
      Immutable = require('Immutable'),
      SceneFrame = require('../components/SceneFrame.react'),
      SceneFrameProperties = require('./SceneFrameProperties'),
      PhysicalBoardState = require('./PhysicalBoardState'),
      getPhysicalState = require('./getPhysicalState'),
      Game = require('./Game'),
      ComputerPlayer = require('./ComputerPlayer');

function MainDriver(props) {
    this.host = props.host;
    this.sceneFrameProperties = props.sceneFrameProperties || SceneFrameProperties.defaultProperties;

    this.playerTurn = 0;
    this.boardState = PhysicalBoardState.emptyBoard;
}

MainDriver.prototype.handleMetaGameStateChange = function(metaGameState) {
    let physicalState = getPhysicalState({
            humanCanMove:   metaGameState.isWaitingForHuman,
            lastMove:       metaGameState.lastMove
        }, metaGameState.gameState);

    console.log(metaGameState.gameState.balance);

    this.boardState = physicalState;
    this.playerTurn = metaGameState.playerTurn;
    this.invalidate();
};


MainDriver.prototype.handleSquareClicked = function(data) {
    console.log('square clicked:');
    console.log(data);
    if(this.game) {
        let squareIndex = 16 * data.planeIndex + 4 * data.rowIndex + data.colIndex;
        this.game.submitMove(squareIndex);
    }
};

MainDriver.prototype.handleAnimationFrame = function(t) {
    console.log(t);

    let frame = React.createElement(SceneFrame, {
        sceneFrameProperties:  this.sceneFrameProperties,
        playerTurn:  this.playerTurn,
        boardState:  this.boardState,
        onClickSquare:  this.handleSquareClicked.bind(this)
    });

    React.render(frame, this.host);

    if(this.boardState.isAnimating) {
        this.invalidate();
    }
};


MainDriver.prototype.invalidate = function() {
    if(this.running) {
        if(this.updateLevel > 0) {
            this.dirty = true;
        } else {
            window.requestAnimationFrame(this.handleAnimationFrame.bind(this));
        }
    }
};

MainDriver.prototype.run = function() {
    this.running = true;
    this.invalidate();
};

MainDriver.prototype.stop = function() {
    this.running = false;
};

MainDriver.prototype.beginUpdate = function() {
    this.updateLevel += 1;
};

MainDriver.prototype.endUpdate = function() {
    this.updateLevel -= 1;
    if(this.updateLevel === 0) {
        if(this.dirty) {
            this.dirty = false;
            this.invalidate();
        }
    } else if (this.updateLevel < 0) {
        throw new Error('each call to endUpdate must match a call to beginUpdate');
    }
};


MainDriver.prototype.runSandboxGame = function() {
    let player1 = null,   //new ComputerPlayer({ playerIndex: 1}),
        player2 = new ComputerPlayer({ playerIndex: -1});

    let game = new Game({
        player1, player2, onStateChange: this.handleMetaGameStateChange.bind(this)
    });

    this.game = game;
    game.start();
};

module.exports = MainDriver;