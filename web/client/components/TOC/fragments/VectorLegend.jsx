/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');

var VectorLegend = React.createClass({
    propTypes: {
        node: React.PropTypes.object,
        showOnlyIfVisible: React.PropTypes.bool,
        currentZoomLvl: React.PropTypes.number,
        scales: React.PropTypes.array,
        renderers: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            showOnlyIfVisible: false,
            renderers: {
                'Point': (style) => <circle cx={15} cy={15} r={5} fill={style.fill && style.fill.color || 'blue'}
                    stroke={style.stroke && style.stroke.color || 'blue'}
                    strokeWidth={style.stroke && style.stroke.width || 0}
                    strokeOpacity={style.stroke && style.stroke.opacity || 1.0}
                    fillOpacity={style.fill && style.fill.opacity || 1.0}
                    />,
                'LineString': (style) => <path d="M5 5 l 20 20"
                    stroke={style.stroke && style.stroke.color || 'blue'}
                    strokeWidth={style.stroke && style.stroke.width || 0}
                    strokeOpacity={style.stroke && style.stroke.opacity || 1.0}
                    />,
                'Polygon': (style) => <rect x="5" y="5" width="20" height="20"
                        fill={style.fill && style.fill.color || 'rgba(0,0,0,0)'}
                        stroke={style.stroke && style.stroke.color || 'blue'}
                        strokeWidth={style.stroke && style.stroke.width || 0}
                        strokeOpacity={style.stroke && style.stroke.opacity || 1.0}
                        fillOpacity={style.fill && style.fill.opacity || 0.0}
                        />
            }
        };
    },
    renderSample(node) {
        if (node.style && node.style.type && this.props.renderers[node.style.type]) {
            return this.props.renderers[node.style.type](node.style);
        }
    },
    render() {
        let node = this.props.node || {};
        if (this.canShow(node) && node.type === "vector" && node.group !== "background") {
            return (<div style={{marginLeft: "15px"}}>
                <svg width="30" height="30">
                    {this.renderSample(node)}
                </svg>
            </div>);
        }
        return null;
    },
    canShow(node) {
        return node.visibility || !this.props.showOnlyIfVisible;
    }
});

module.exports = VectorLegend;
