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
    GameBoard = require('./GameBoard.react');


const Playfield = React.createClass({

    render() {
        const sceneFrameProperties = this.props.sceneFrameProperties;

        const
            board = React.createElement(GameBoard, {
                t:     this.props.t,
                skew: sceneFrameProperties.skew,
                boardState:  this.props.boardState,
                onClickSquare:  this.props.onClickSquare
            });

        const
            container = React.DOM.g({
                transform: 'translate(300,600),scale(40)'
            }, board); //. xPiece, oPiece);


        return container;
    }

});


module.exports = Playfield;