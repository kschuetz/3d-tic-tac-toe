

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
    _ = require('lodash');



const FlatO = React.createClass({
    render() {

        return React.DOM.circle({
            r: 0.34,
            className:  this.props.className,
            transform: this.props.transform,
            strokeWidth: 0.29
        });

    }


});

const OPiece = React.createClass({
    render() {
        const depth = 0.05;

        const upperO = React.createElement(FlatO, {
            className: 'o-piece-front',
            transform: 'skewX(0)'
        }),

        lowerO = React.createElement(FlatO, {
            className: 'o-piece-side',
            transform: 'translate(0,' + depth + '),skewX(0)'
        });

        return React.DOM.g({
            transform: this.props.transform
        }, lowerO, upperO);


    }
});



module.exports = OPiece;