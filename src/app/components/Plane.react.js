
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



const HorizontalBeam = React.createClass({
    render() {
        const ht = this.props.thickness / 2;
        return React.DOM.rect({
            x:     this.props.x - ht,
            y:     this.props.y - ht,
            width:  this.props.width + this.props.thickness,
            height: this.props.thickness,
            className: 'plane-horizontal-beam'
        });
    }
});


const VerticalBeam = React.createClass({
    render() {
        const ht = this.props.thickness / 2;
        return React.DOM.rect({
            x:     this.props.x - ht,
            y:     this.props.y - ht,
            width: this.props.thickness,
            height: this.props.height + this.props.thickness,
            className: 'plane-vertical-beam'
        });
    }
});


const FlatPlane = React.createClass({
    render() {
        let beams = [];
        for(let i=0; i < 5; i += 1) {
            let hbeam = React.createElement(HorizontalBeam, {
                key: 'h' + i,
                x: -2,
                y: i - 2,
                width: 4,
                thickness: 0.1
            }),
                vbeam = React.createElement(VerticalBeam, {
                    key: 'v' + i,
                    x:   i - 2,
                    y:   -2,
                    height: 4,
                    thickness: 0.1
                });

            beams.push(hbeam);
            beams.push(vbeam);
        }

        return React.DOM.g({
            className: this.props.className,
            transform: this.props.transform
        }, beams);
    }
});

const Plane = React.createClass({
    render() {
        const depth = 0.05,
              skew = this.props.skew || 0;
        const topPlane = React.createElement(FlatPlane, { className: 'plane-top', transform: 'skewX(' + skew + ')'}),
            bottomPlane = React.createElement(FlatPlane, { className: 'plane-bottom', transform: 'translate(0,' + depth + '),skewX(' + skew + ')'});

        return React.DOM.g({
            transform: this.props.transform
        }, bottomPlane, topPlane);
    }
});



module.exports = Plane;