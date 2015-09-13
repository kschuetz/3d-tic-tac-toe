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
      PhysicalBoardState = require('../core/PhysicalBoardState');

function MainDriver(props) {
    this.host = props.host;
    this.sceneFrameProperties = props.sceneFrameProperties || SceneFrameProperties.defaultProperties;

    this.boardState = PhysicalBoardState.emptyBoard;
}


MainDriver.prototype.handleSquareClicked = function(data) {
    console.log('square clicked:');
    console.log(data);
};

MainDriver.prototype.redraw = function() {
    let frame = React.createElement(SceneFrame, {
        sceneFrameProperties:  this.sceneFrameProperties,
        boardState:  this.boardState,
        onClickSquare:  this.handleSquareClicked.bind(this)
    });

    React.render(frame, this.host);
};


MainDriver.prototype.invalidate = function() {
    if(this.running) {
        if(this.updateLevel > 0) {
            this.dirty = true;
        } else {
            setTimeout(this.redraw.bind(this));
        }
    }
};

MainDriver.prototype.run = function() {
    this.running = true;
    this.redraw();
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

module.exports = MainDriver;