
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



const XLeg = React.createClass({
    render() {
        return React.DOM.rect({
            x: -0.17,
            y: -0.5,
            width: 0.34,
            height: 1,
            transform: this.props.transform
        });
    }
});


const FlatX = React.createClass({
    render() {

        const leg1 = React.createElement(XLeg, { transform: 'skewX(45)'}),
              leg2 = React.createElement(XLeg, { transform: 'skewX(-45)'});

        return React.DOM.g({
            className:  this.props.className,
            transform: this.props.transform,
            fill: this.props.fill
        }, leg1, leg2);

    }


});

const XPiece = React.createClass({
    render() {
        const depth = 0.05;

        const
            topLeft = React.DOM.rect({
                width: 0.34,
                x:     -0.67,
                y:     -0.5,
                height: depth,
                className: 'x-piece-side'
            }),

            topRight = React.DOM.rect({
                width: 0.34,
                x:     0.33,
                y:     -0.5,
                height: depth,
                className: 'x-piece-side'
            }),

            bottomLeft = React.DOM.rect({
                width: 0.34,
                x:     -0.67,
                y:     0.5,
                height: depth,
                className:  'x-piece-bottom'
            }),

            bottomRight = React.DOM.rect({
                width: 0.34,
                x:     0.33,
                y:     0.5,
                height: depth,
                className:  'x-piece-bottom'
            }),


            upperX = React.createElement(FlatX, {
                className: 'x-piece-front',
                transform: 'skewX(0)'
            }),
            lowerX = React.createElement(FlatX, {
                className: 'x-piece-side',
                transform: 'translate(0,' + depth + '),skewX(0)'
            });

        return React.DOM.g({
            transform: this.props.transform
        }, lowerX, topLeft, topRight, bottomLeft, bottomRight, upperX);
    }
});


module.exports = XPiece;
