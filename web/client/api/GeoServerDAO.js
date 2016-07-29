/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const axios = require('../libs/ajax');
const assign = require('object-assign');

const ConfigUtils = require('../utils/ConfigUtils');

var Api = {
    getRules: function(rulesPage, rulesFiltersValues) {
        const options = {
            'params': {
                'page': rulesPage,
                'entries': 10
            }
        };
        this.assignFiltersValue(rulesFiltersValues, options);
        return axios.get('geofence/rest/rules', this.addBaseUrl(options)).then(function(response) {
            return response.data;
        });
    },
    getRulesCount: function(rulesFiltersValues) {
        const options = {
            'params': {}
        };
        this.assignFiltersValue(rulesFiltersValues, options);
        return axios.get('geofence/rest/rules/count', this.addBaseUrl(options)).then(function(response) {
            return response.data;
        });
    },
    assignFiltersValue: function(rulesFiltersValues, options) {
        if (rulesFiltersValues) {
            this.assignFilterValue(options.params, 'userName', 'userAny', rulesFiltersValues.user);
            this.assignFilterValue(options.params, 'roleName', 'roleAny', rulesFiltersValues.group);
            this.assignFilterValue(options.params, 'service', 'serviceAny', rulesFiltersValues.service);
            this.assignFilterValue(options.params, 'request', 'requestAny', rulesFiltersValues.request);
            this.assignFilterValue(options.params, 'workspace', 'workspaceAny', rulesFiltersValues.workspace);
            this.assignFilterValue(options.params, 'layer', 'layerAny', rulesFiltersValues.layer);
        }
        return options;
    },
    assignFilterValue: function(queryParameters, filterName, filterAny, filterValue) {
        if (!filterValue) {
            return;
        }
        if (filterValue === '*') {
            assign(queryParameters, {[filterAny]: 1});
        } else {
            assign(queryParameters, {[filterName]: filterValue});
        }
    },
    getGroups: function() {
        return axios.get('security/rest/roles', this.addBaseUrl({
            'headers': {
                'Accept': 'application/json'
            }
        })).then(function(response) {
            return response.data;
        });
    },
    getUsers: function() {
        return axios.get('security/rest/usergroup/users', this.addBaseUrl({
            'headers': {
                'Accept': 'application/json'
            }
        })).then(function(response) {
            return response.data;
        });
    },
    getWorkspaces: function() {
        return axios.get('rest/workspaces', this.addBaseUrl({
            'headers': {
                'Accept': 'application/json'
            }
        })).then(function(response) {
            return response.data;
        });
    },
    submitNewRule: function(ruleValues) {
        const rule = {
            'userName': ruleValues.user,
            'roleName': ruleValues.group,
            'service': ruleValues.service,
            'request': ruleValues.request,
            'workspace': ruleValues.workspace,
            'layer': ruleValues.layer,
            'access': ruleValues.access
        };
        return axios.post('geofence/rest/rules', rule, this.addBaseUrl({
            'headers': {
                'Content': 'application/json'
            }
        }));
    },
    saveRule: function(ruleValues) {
        const rule = {
            'userName': this.nullToAny(ruleValues.user),
            'roleName': this.nullToAny(ruleValues.group),
            'service': this.nullToAny(ruleValues.service),
            'request': this.nullToAny(ruleValues.request),
            'workspace': this.nullToAny(ruleValues.workspace),
            'layer': this.nullToAny(ruleValues.layer),
            'access': this.nullToAny(ruleValues.access)
        };
        return axios.post('geofence/rest/rules/id/' + ruleValues.id, rule, this.addBaseUrl({
            'headers': {
                'Content': 'application/json'
            }
        }));
    },
    nullToAny: function(value) {
        return !value ? '*' : value;
    },
    deleteRule: function(ruleId) {
        return axios.delete('geofence/rest/rules/id/' + ruleId, this.addBaseUrl({}));
    },
    addBaseUrl: function(options) {
        return assign(options, {baseURL: ConfigUtils.getDefaults().geoServerUrl});
    }
};

module.exports = Api;
