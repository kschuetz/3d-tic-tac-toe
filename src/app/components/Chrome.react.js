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


const Chrome = React.createClass({

    render() {
        let sceneFrameProperties = this.props.sceneFrameProperties;

        let width = sceneFrameProperties.chromeWidth,
            chromeMargin = sceneFrameProperties.chromeMargin,
            height = sceneFrameProperties.height - 2 * chromeMargin;

        let background = React.createElement(ChromeBackground, { width, height });

        let turnIndicator = React.createElement(TurnIndicator, {
            scale:  25,
            transform: 'translate(-60, -350)'
        });

        return React.DOM.g({
            transform: this.props.transform
        }, background, turnIndicator);
    }
});

module.exports = Chrome;