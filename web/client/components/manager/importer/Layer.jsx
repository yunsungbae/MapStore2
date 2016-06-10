/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Panel} = require('react-bootstrap');


const Layer = React.createClass({
    propTypes: {
        layer: React.PropTypes.object,
        panProps: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            layer: {}
        };
    },
    render() {
        return (<Panel {...this.props.panProps} header={<span>Layer</span>}>
            <dl className="dl-horizontal">
              <dt>name</dt>
              <dd>{this.props.layer.name}</dd>
            </dl>
        </Panel>);
    }
});
module.exports = Layer;
