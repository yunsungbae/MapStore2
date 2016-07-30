/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const RulesTablePanel = require('./RulesTablePanel');

const RulesManager = React.createClass({
    propTypes: {
        onSelectRules: React.PropTypes.func,
        moveRules: React.PropTypes.func,
        loadRules: React.PropTypes.func,
        rules: React.PropTypes.array,
        rulesPage: React.PropTypes.number,
        rulesCount: React.PropTypes.number,
        selectedRules: React.PropTypes.array,
        rulesTableError: React.PropTypes.string
    },
    render() {
        return (
            <RulesTablePanel
                onSelectRules={this.props.onSelectRules}
                rules={this.props.rules}
                selectedRules={this.props.selectedRules}
                moveRules={this.props.moveRules}
                loadRules={this.props.loadRules}
                rulesPage={this.props.rulesPage}
                rulesCount={this.props.rulesCount}/>
        );
    }
});

module.exports = RulesManager;
