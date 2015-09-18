
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
    Plane = require('./Plane.react'),
    XPiece = require('./XPiece.react'),
    OPiece = require('./OPiece.react'),
    AnimStates = require('../core/AnimStates');


const
    flashFreq = 0.04,
    phaseOffsets = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2],
    flashAmplitude = 0.5;


const BoardPiece = React.createClass({
    render() {
        const squareState = this.props.squareState,
              x = this.props.x,
              y = this.props.y,
              flashScale = this.props.flashScale || 1;

        let scale = this.props.scale || 0.7;

        let animState = squareState.animState;
        if(animState === AnimStates.HIGHLIGHTED) {
            scale = scale * 1.3;
        } else if (animState === AnimStates.FLASHING) {
            scale = scale * flashScale;
        }

        let pieceClass;
        if(squareState.isXPiece) {
            pieceClass = XPiece;
            scale = scale * 0.86;
        } else if (squareState.isOPiece) {
            pieceClass = OPiece;
        } else {
            return null;
        }

        let transform = `translate(${x},${y}),scale(${scale})`;

        return React.createElement(pieceClass, {
            transform
        });
    }
});


const SquareButtonLayer = React.createClass({

    _handleClick() {
        if(this.props.onClick) {
            this.props.onClick({
                planeIndex:  this.props.planeIndex,
                rowIndex:    this.props.rowIndex,
                colIndex:    this.props.colIndex
            });
        }
    },

    render() {
        const x = this.props.x,
              y = this.props.y;
        let transform = `translate(${x},${y})`;

        return React.DOM.rect({
            className:  'square-button-layer',
            x: x - 0.5,
            y: y - 0.5,
            width:  1,
            height: 1,
            onClick:  this._handleClick
        });
    }
});

const GameBoardPlane = React.createClass({
    render() {
        const boardState = this.props.boardState,
              planeIndex = this.props.planeIndex,
              y = this.props.y || 0,
              skew = this.props.skew || 0,
              t = this.props.t;

        let plane = React.createElement(Plane, { skew });

        let planeContents = [];



        for(let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
            const yPos = rowIndex - 1.5;

            for(let colIndex = 0; colIndex < 4; colIndex += 1) {
                const xPos = colIndex - 1.5;

                let phaseOffsetIndex = (planeIndex + colIndex + rowIndex) % 4,
                    phaseOffset = phaseOffsets[phaseOffsetIndex],
                    flashT = phaseOffset + (flashFreq * t) / (2 * Math.PI),
                    flashScale = 1.0 + flashAmplitude * Math.abs(Math.sin(flashT));

                let square = boardState.getSquare(planeIndex, rowIndex, colIndex),
                    piece = React.createElement(BoardPiece, {
                        key: `piece-${rowIndex}-${colIndex}`,
                        squareState: square,
                        x: xPos,
                        y: yPos,
                        flashScale
                    });

                if(piece) {
                    planeContents.push(piece);
                }

                if(square.clickable) {
                    let button = React.createElement(SquareButtonLayer, {
                        key: `button-${rowIndex}-${colIndex}`,
                        planeIndex,
                        rowIndex,
                        colIndex,
                        x: xPos,
                        y: yPos,
                        onClick:  this.props.onClickSquare
                    });

                    planeContents.push(button);
                }


            }
        }

        let contentsGroup = React.DOM.g({
            transform: `skewX(${skew})`
        }, planeContents);

        return React.DOM.g({
            transform:  `translate(0,${y})`
        }, plane, contentsGroup);

    }
});

const GameBoard = React.createClass({
    render() {
        const skew = -30,
              spacing = 5,
              t = this.props.t,
              onClickSquare = this.props.onClickSquare;

        let planes = [],
            y = -2.5 * spacing;
        for(let planeIndex = 0; planeIndex < 4; planeIndex += 1, y += spacing) {
            let plane = React.createElement(GameBoardPlane, {
                key: 'plane' + planeIndex,
                t,
                planeIndex,
                boardState: this.props.boardState,
                y,
                skew,
                onClickSquare
            });
            planes.push(plane);
        }
        return React.DOM.g(null, planes);
    }
});



module.exports = GameBoard;