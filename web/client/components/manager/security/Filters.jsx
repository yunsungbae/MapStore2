/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Rule = require('./Rule');
const LocaleUtils = require('../../../utils/LocaleUtils');

const Filters = React.createClass({
    propTypes: {
        loadGroups: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        services: React.PropTypes.object,
        options: React.PropTypes.object,
        updateFiltersValues: React.PropTypes.func,
        filtersValues: React.PropTypes.object
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    render() {
        const panelHeader = LocaleUtils.getMessageById(this.context.messages, 'security.filters');
        return (
            <Rule
                panelHeader={panelHeader}
                loadGroups={this.props.loadGroups}
                loadUsers={this.props.loadUsers}
                loadWorkspaces={this.props.loadWorkspaces}
                loadLayers={this.props.loadLayers}
                services={this.props.services}
                options={this.props.options}
                updateRuleValues={this.props.updateFiltersValues}
                selectedValues={this.props.filtersValues}
                containerClassName="filters-container"
                selectClassName="col-md-2"/>
        );
    }
});

module.exports = Filters;
