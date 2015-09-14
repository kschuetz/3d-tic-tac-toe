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
    consts = require('./consts'),
    FlatX = require('./FlatX.react'),
    FlatO = require('./FlatO.react'),
    players = require('../core/players');


const ChromeBackground = React.createClass({

    render() {
        let width = this.props.width || 200,
            halfWidth = width / 2,
            height = this.props.height || 700,
            halfHeight = height / 2;
        return React.DOM.rect({
            className: 'chrome-background',
            x: -halfWidth,
            y: -halfHeight,
            width: width,
            height: height
        });
    }


});

const TurnIndicator = React.createClass({
    getDefaultProps() {
        return {
            stemThickness: 1,
            scale: 1
        };
    },
    render() {
        let s = this.props.scale,
            st = this.props.stemThickness * s,
            hst = st / 2;

        return React.DOM.polygon({
            className:  'turn-indicator',
            points: `0,-${s} ${s},0 0,${s} 0,${hst} -${s},${hst} -${s},-${hst}, 0,-${hst}`,
            transform:  this.props.transform
        });
    }
});


const PlayerRow = React.createClass({
    getDefaultProps() {
        return {
            width: 180,
            height: 60
        };
    },

    render() {
        const
            isOPlayer = this.props.player === players.O,
            isPlayerTurn = this.props.isPlayerTurn,
            width = this.props.width,
            height = this.props.height,
            hw = width / 2,
            hh = height / 2,
            iconClass = isOPlayer ? FlatO : FlatX,
            iconCss = isOPlayer ? 'chrome-icon-o' : 'chrome-icon-x';

        const background = React.DOM.rect({
            className: 'chrome-player-row',
            x: -hw,
            y: -hh,
            width,
            height
        });


        let tiWidth = (height / 2) - 10,
            tiLeft = tiWidth - hw + 5;

        let turnIndicator = null;
        if(isPlayerTurn) {
            turnIndicator = React.createElement(TurnIndicator, {
                scale:  tiWidth,
                transform: `translate(${tiLeft}, 0)`
            });
        }

        const
              iconMultiplier = isOPlayer ? consts.oPieceScale : consts.xPieceScale,
              iconWidth = height * 0.8,
              iconScale = iconWidth * iconMultiplier,
              iconLeft = tiLeft + tiWidth + 5 + (iconWidth / 2);

        const pieceIcon = React.createElement(iconClass, {
            className:  iconCss,
            transform: `translate(${iconLeft},0),scale(${iconScale})`
        });

        let nameLabel = null;

        return React.DOM.g({
            transform:  this.props.transform
        }, background, pieceIcon, turnIndicator, nameLabel);
    }


});


const Chrome = React.createClass({

    render() {
        let sceneFrameProperties = this.props.sceneFrameProperties,
            playerTurn = this.props.playerTurn;

        let width = sceneFrameProperties.chromeWidth,
            chromeMargin = sceneFrameProperties.chromeMargin,
            height = sceneFrameProperties.height - 2 * chromeMargin;

        let background = React.createElement(ChromeBackground, { width, height });

        //let turnIndicator = React.createElement(TurnIndicator, {
        //    scale:  25,
        //    transform: 'translate(-60, -350)'
        //});

        let player1Row = React.createElement(PlayerRow, {
            player:  players.X,
            isPlayerTurn:   playerTurn === players.X,
            transform:  'translate(0, -350)'
        });

        let player2Row = React.createElement(PlayerRow, {
            player:  players.O,
            isPlayerTurn:  playerTurn === players.O,
            transform:  'translate(0, -270)'
        });

        return React.DOM.g({
            transform: this.props.transform
        }, background, player1Row, player2Row);
    }
});

module.exports = Chrome;