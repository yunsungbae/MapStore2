/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Panel} = require('react-bootstrap');
const _ = require('lodash');

const Select = require('./Select');

const ACCESS_TYPES = [
    'ALLOW',
    'DENY'
];

const Rule = React.createClass({
    propTypes: {
        panelHeader: React.PropTypes.string,
        loadGroups: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        services: React.PropTypes.object,
        options: React.PropTypes.object,
        updateRuleValues: React.PropTypes.func,
        selectedValues: React.PropTypes.object,
        showAccess: React.PropTypes.bool,
        containerClassName: React.PropTypes.string,
        selectClassName: React.PropTypes.string
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            loadGroups: () => {},
            loadUsers: () => {},
            loadWorkspaces: () => {},
            loadLayers: () => {},
            services: {},
            options: [],
            updateRuleValues: () => {},
            selectedValues: {},
            showAccess: false
        };
    },
    getServicesNames() {
        return Object.keys(this.props.services);
    },
    getRequestsNames() {
        if (this.props.selectedValues.service) {
            return this.props.services[this.props.selectedValues.service];
        }
        return _(Object.values(this.props.services)).flatten().uniq().value();
    },
    getAccessValue() {
        let value = this.props.selectedValues.access;
        if (value) {
            return value;
        }
        this.props.updateRuleValues('access', ACCESS_TYPES[0]);
        return ACCESS_TYPES[0];
    },
    render() {
        const requestNames = this.getRequestsNames() || [];
        const requestFilterValue = this.filterValue(this.props.selectedValues.request, requestNames);
        return (
            <Panel header={this.props.panelHeader} className={this.props.containerClassName}>
                <Select
                    loadOptions={this.props.loadGroups}
                    onValueUpdated={this.createUpdateFunction('group')}
                    selectedValue={this.props.selectedValues.group}
                    placeholderMsgId={'security.group'}
                    options={this.props.options.group}
                    className={this.props.selectClassName}/>
                <Select
                    loadOptions={this.props.loadUsers}
                    onValueUpdated={this.createUpdateFunction('user')}
                    selectedValue={this.props.selectedValues.user}
                    placeholderMsgId={'security.user'}
                    options={this.props.options.user}
                    className={this.props.selectClassName}/>
                <Select
                    onValueUpdated={this.createUpdateFunction('service')}
                    selectedValue={this.props.selectedValues.service}
                    placeholderMsgId={'security.service'}
                    options={this.getServicesNames()}
                    className={this.props.selectClassName}/>
                <Select
                    onValueUpdated={this.createUpdateFunction('request')}
                    selectedValue={requestFilterValue}
                    placeholderMsgId={'security.request'}
                    options={requestNames}
                    className={this.props.selectClassName}/>
                <Select loadOptions={this.props.loadWorkspaces}
                    onValueUpdated={this.createUpdateFunction('workspace')}
                    selectedValue={this.props.selectedValues.workspace}
                    placeholderMsgId={'security.workspace'}
                    options={this.props.options.workspace}
                    className={this.props.selectClassName}/>
                <Select loadOptions={this.props.loadLayers}
                    onInputChange={this.props.loadLayers}
                    onValueUpdated={this.createUpdateFunction('layer')}
                    selectedValue={this.props.selectedValues.layer}
                    placeholderMsgId={'security.layer'}
                    options={this.props.options.layer}
                    className={this.props.selectClassName}/>
                {
                    this.props.showAccess &&
                    <Select onValueUpdated={this.createUpdateFunction('access')}
                        selectedValue={this.getAccessValue()}
                        placeholderMsgId={'security.access'}
                        options={ACCESS_TYPES}
                        className={this.props.selectClassName}/>
                }
            </Panel>
        );
    },
    filterValue(value, values) {
        if (value && values.find(existing => existing === value)) {
            return value;
        }
        return undefined;
    },
    createUpdateFunction(filterName) {
        const updateRuleValues = this.props.updateRuleValues;
        return function(filterValue) {
            updateRuleValues(filterName, filterValue ? filterValue.value : filterValue);
        };
    }
});

module.exports = Rule;
