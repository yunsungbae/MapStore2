/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CHANGE_PASSWORD_SUCCESS,
        GROUPS_LOADED, USERS_LOADED, WORKSPACES_LOADED, UPDATE_RULES_FILTERS_VALUES,
        RULES_LOADED, LAYERS_LOADED, UPDATE_RULES_PAGE, RULES_SELECTED,
        RULES_UNSELECTED, CLEAN_SELECTED_RULES, SHOW_MODAL,
        UPDATE_NEW_RULE_VALUES, UPDATE_NEW_RULE_STATUS, SET_NEW_RULE_VALUES} = require('../actions/security');
const SecurityUtils = require('../utils/SecurityUtils');
const _ = require('lodash');

const assign = require('object-assign');

function security(state = {user: null, errorCause: null}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            const userAttributes = SecurityUtils.getUserAttributes(action.userDetails.User);
            const userUuid = userAttributes.find(attribute => attribute.name.toLowerCase() === 'uuid');
            return assign({}, state, {
                user: action.userDetails.User,
                token: userUuid && userUuid.value || '',
                authHeader: action.authHeader,
                loginError: null
            });
        case LOGIN_FAIL:
            return assign({}, state, {
                loginError: action.error
            });
        case LOGOUT:
            return assign({}, state, {
                user: null,
                token: null,
                authHeader: null,
                loginError: null
            });
        case CHANGE_PASSWORD_SUCCESS:
            return assign({}, state, {
                user: assign({}, state.user, assign({}, action.user, {date: new Date().getUTCMilliseconds()})),
                authHeader: action.authHeader
            });
        case GROUPS_LOADED:
            return assign({}, state, {
                groups: action.groups.roles
            });
        case USERS_LOADED:
            return assign({}, state, {
                users: action.users.users
            });
        case WORKSPACES_LOADED:
            return assign({}, state, {
                workspaces: action.workspaces && action.workspaces.workspaces.workspace || []
            });
        case LAYERS_LOADED:
            return assign({}, state, {
                layers: action.layers || []
            });
        case UPDATE_RULES_FILTERS_VALUES:
            return assign({}, state, {
                rulesFiltersValues: assign({}, state.rulesFiltersValues || {}, action.filterValue)
            });
        case UPDATE_RULES_PAGE:
            return assign({}, state, {
                rulesPage: action.page || 1
            });
        case RULES_LOADED:
            return assign({}, state, {
                rules: action.rules && action.rules.rules || [],
                rulesCount: action.rulesCount && action.rulesCount.count || 0
            });
        case RULES_SELECTED: {
            let rules = state.selectedRules || [];
            rules = _(rules).concat(action.rules).uniq(rule => rule.id).value();
            return assign({}, state, {
                selectedRules: rules
            });
        }
        case RULES_UNSELECTED: {
            let rules = state.selectedRules || [];
            rules = _(rules).filter(
                rule => !action.rules.find(unselected => unselected.id === rule.id)).value();
            return assign({}, state, {
                selectedRules: rules
            });
        }
        case CLEAN_SELECTED_RULES:
            return assign({}, state, {
                selectedRules: []
            });
        case SHOW_MODAL:
            return assign({}, state, {
                modalToShow: action.modalName
            });
        case UPDATE_NEW_RULE_VALUES:
            return assign({}, state, {
                newRuleValues: assign({}, state.newRuleValues || {}, action.value)
            });
        case UPDATE_NEW_RULE_STATUS:
            return assign({}, state, {
                newRuleStatus: assign({}, state.newRuleStatus || {}, action.status)
            });
        case SET_NEW_RULE_VALUES:
            return assign({}, state, {
                newRuleValues: action.values
            });
        default:
            return state;
    }
}

module.exports = security;
