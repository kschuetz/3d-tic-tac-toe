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
    FlatX = require('./FlatX.react'),
    FlatO = require('./FlatO.react');


const PieceIcon = React.createClass({
    render() {
        const pieceClass = this.props.player === 2 ? FlatO : FlatX;
        return React.DOM.svg(null,
            React.DOM.g({
                transform: 'scale(20)'
            }, React.createElement(pieceClass)));
    }
});

const PlayerRow = React.createClass({
    render() {

        const turnIndicator = React.DOM.div({
            className:  'col-md-2'
        }, '->');

        const pieceCell = React.DOM.div({
            className:  'col-md-2'
        }, React.createElement(PieceIcon, { player: this.props.player }));

        const playerNameCell = React.DOM.div({
            className:  'col-md-8'
        }, 'PLAYER');

        return React.DOM.div({
            className: 'row'
        }, turnIndicator, pieceCell, playerNameCell);

    }

});


const PlayerSwap = React.createClass({
    render() {

        return React.DOM.div({});
    }
});

const PlayerGrid = React.createClass({
    render() {
        const player1Row = React.createElement(PlayerRow, { player: 1}),
              player2Row = React.createElement(PlayerRow, { player: 2});

        const playerRows = React.DOM.div({
            className: 'col-md-8'
        }, player1Row, player2Row);

        const playerSwapCell = React.createElement({
            className: 'col-md-4'
        }, React.createElement(PlayerSwap, {}));

        return React.DOM.div({
            className: 'row'
        }, playerRows, playerSwapCell);
    }
});

const Chrome = React.createClass({

    render() {

        const playerGrid = React.createElement(PlayerGrid);



        return React.DOM.div({

        }, playerGrid);

    }
});

module.exports = Chrome;