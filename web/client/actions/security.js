/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const GeoStoreAPI = require('../api/GeoStoreDAO');
const GeoServerAPI = require('../api/GeoServerDAO');
const CatalogAPI = require('../api/CSW');
const ConfigUtils = require('../utils/ConfigUtils');

const axios = require('../libs/ajax');

const LOGIN_SUBMIT = 'LOGIN_SUBMIT';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';
const LOGOUT = 'LOGOUT';
const GROUPS_LOADED = 'GROUPS_LOADED';
const GROUPS_LOAD_ERROR = 'GROUPS_LOAD_ERROR';
const USERS_LOADED = 'USERS_LOADED';
const USERS_LOAD_ERROR = 'USERS_LOAD_ERROR';
const WORKSPACES_LOADED = 'WORKSPACES_LOADED';
const WORKSPACES_LOAD_ERROR = 'WORKSPACES_LOAD_ERROR';
const RULES_LOADED = 'RULES_LOADED';
const RULES_LOAD_ERROR = 'RULES_LOAD_ERROR';
const LAYERS_LOADED = 'LAYERS_LOADED';
const LAYERS_LOAD_ERROR = 'LAYERS_LOAD_ERROR';
const UPDATE_RULES_FILTERS_VALUES = 'UPDATE_RULES_FILTERS_VALUES';
const UPDATE_RULES_PAGE = 'UPDATE_RULES_PAGE';
const RULES_SELECTED = 'RULES_SELECTED';
const RULES_UNSELECTED = 'RULES_UNSELECTED';
const CLEAN_SELECTED_RULES = 'CLEAN_SELECT_RULES';
const SHOW_MODAL = 'SHOW_MODAL';
const UPDATE_NEW_RULE_VALUES = 'UPDATE_NEW_RULE_VALUES';
const UPDATE_NEW_RULE_STATUS = 'UPDATE_NEW_RULE_STATUS';
const SET_NEW_RULE_VALUES = 'SET_NEW_RULE_VALUES';

function loginSuccess(userDetails, username, password, authProvider) {
    return {
        type: LOGIN_SUCCESS,
        userDetails: userDetails,
        // set here for compatibility reasons
        authHeader: 'Basic ' + btoa(username + ':' + password),
        username: username,
        password: password,
        authProvider: authProvider
    };
}

function loginFail(e) {
    return {
        type: LOGIN_FAIL,
        error: e
    };
}

function logout(redirectUrl) {
    return {
        type: LOGOUT,
        redirectUrl: redirectUrl
    };
}

function geoStoreLoginSubmit(username, password) {
    return (dispatch) => {
        GeoStoreAPI.basicLogin(username, password).then((response) => {
            dispatch(loginSuccess(response, username, password, 'geostore'));
        }).catch((e) => {
            dispatch(loginFail(e));
        });
    };
}

function changePasswordSuccess(user, newPassword) {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        user: user,
        authHeader: 'Basic ' + btoa(user.name + ':' + newPassword)
    };
}

function changePasswordFail(e) {
    return {
        type: CHANGE_PASSWORD_FAIL,
        error: e
    };
}

function geoStoreChangePassword(user, newPassword) {
    return (dispatch) => {
        GeoStoreAPI.changePassword(user, newPassword).then(() => {
            dispatch(changePasswordSuccess(user, newPassword));
        }).catch((e) => {
            dispatch(changePasswordFail(e));
        });
    };
}

function groupsLoaded(groups) {
    return {
        type: GROUPS_LOADED,
        groups: groups
    };
}

function groupsLoadError(error) {
    return {
        type: GROUPS_LOAD_ERROR,
        error: error
    };
}

function getGroups() {
    return (dispatch) => {
        GeoServerAPI.getGroups().then((groups) => {
            dispatch(groupsLoaded(groups));
        }).catch((error) => {
            dispatch(groupsLoadError(error));
        });
    };
}

function usersLoaded(users) {
    return {
        type: USERS_LOADED,
        users: users
    };
}

function usersLoadError(error) {
    return {
        type: USERS_LOAD_ERROR,
        error: error
    };
}

function getUsers() {
    return (dispatch) => {
        GeoServerAPI.getUsers().then((users) => {
            dispatch(usersLoaded(users));
        }).catch((error) => {
            dispatch(usersLoadError(error));
        });
    };
}

function workspacesLoaded(workspaces) {
    return {
        type: WORKSPACES_LOADED,
        workspaces: workspaces
    };
}

function workspacesLoadError(error) {
    return {
        type: WORKSPACES_LOAD_ERROR,
        error: error
    };
}

function getWorkspaces() {
    return (dispatch) => {
        GeoServerAPI.getWorkspaces().then((workspaces) => {
            dispatch(workspacesLoaded(workspaces));
        }).catch((error) => {
            dispatch(workspacesLoadError(error));
        });
    };
}

function rulesLoaded(rules, rulesCount) {
    return {
        type: RULES_LOADED,
        rules: rules,
        rulesCount: rulesCount
    };
}

function rulesLoadError(error) {
    return {
        type: RULES_LOAD_ERROR,
        error: error
    };
}

function getRules() {
    return (dispatch, getState) => {
        const state = getState();
        const securityState = state && state.security;
        axios.all([GeoServerAPI.getRules(securityState.rulesPage - 1 || 0, securityState.rulesFiltersValues),
                   GeoServerAPI.getRulesCount(securityState.rulesFiltersValues)])
          .then(axios.spread(function(rules, rulesCount) {
              dispatch(rulesLoaded(rules, rulesCount));
          })).catch((error) => {
              dispatch(rulesLoadError(error));
          });
    };
}

function layersLoaded(layers) {
    return {
        type: LAYERS_LOADED,
        layers: layers
    };
}

function layersLoadError(error) {
    return {
        type: LAYERS_LOAD_ERROR,
        error: error
    };
}

function getLayers(input) {
    return (dispatch) => {
        const catalogUrl = ConfigUtils.getDefaults().geoServerUrl + 'csw';
        CatalogAPI.textSearch(catalogUrl, 1, 25, input).then((layers) => {
            dispatch(layersLoaded(layers));
        }).catch((error) => {
            dispatch(layersLoadError(error));
        });
    };
}

function updateRulesPage(page) {
    return {
        type: UPDATE_RULES_PAGE,
        page: page
    };
}

function updateRulesFiltersValues(filter, value) {
    return {
        type: UPDATE_RULES_FILTERS_VALUES,
        filterValue: {
            [filter]: value
        }
    };
}

function rulesSelected(rules) {
    return {
        type: RULES_SELECTED,
        rules: rules
    };
}

function rulesUnSelected(rules) {
    return {
        type: RULES_UNSELECTED,
        rules: rules
    };
}

function cleanSelectedRules() {
    return {
        type: CLEAN_SELECTED_RULES
    };
}

function showModal(modalName) {
    return {
        type: SHOW_MODAL,
        modalName: modalName
    };
}

function updateNewRuleValues(name, value) {
    return {
        type: UPDATE_NEW_RULE_VALUES,
        value: {
            [name]: value
        }
    };
}

function updateNewRuleStatus(status) {
    return {
        type: UPDATE_NEW_RULE_STATUS,
        status: status
    };
}

function submitNewRule() {
    return (dispatch, getState) => {
        const state = getState();
        const ruleValues = state.security && state.security.newRuleValues;
        GeoServerAPI.submitNewRule(ruleValues).then(() => {
            dispatch(updateNewRuleStatus({
                'status': 'success'
            }));
        }).catch((error) => {
            dispatch(updateNewRuleStatus({
                'status': 'error',
                'error': error
            }));
        });
    };
}

function setNewRuleValues(values) {
    return {
        type: SET_NEW_RULE_VALUES,
        values: values
    };
}

function saveRule() {
    return (dispatch, getState) => {
        const state = getState();
        const ruleValues = state.security && state.security.newRuleValues;
        GeoServerAPI.saveRule(ruleValues).then(() => {
            dispatch(updateNewRuleStatus({
                'status': 'success'
            }));
        }).catch((error) => {
            dispatch(updateNewRuleStatus({
                'status': 'error',
                'error': error
            }));
        });
    };
}

function deleteRules(rulesIds) {
    return (dispatch) => {
        const calls = rulesIds.map(ruleId => GeoServerAPI.deleteRule(ruleId));
        axios.all(calls).then(() => {
            dispatch(updateNewRuleStatus({
                'status': 'success'
            }));
        }).catch((error) => {
            dispatch(updateNewRuleStatus({
                'status': 'error',
                'error': error
            }));
        });
    };
}

module.exports = {
    LOGIN_SUBMIT,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    GROUPS_LOADED,
    GROUPS_LOAD_ERROR,
    USERS_LOADED,
    USERS_LOAD_ERROR,
    WORKSPACES_LOADED,
    WORKSPACES_LOAD_ERROR,
    LAYERS_LOADED,
    LAYERS_LOAD_ERROR,
    RULES_LOADED,
    RULES_LOAD_ERROR,
    UPDATE_RULES_PAGE,
    UPDATE_RULES_FILTERS_VALUES,
    RULES_SELECTED,
    RULES_UNSELECTED,
    CLEAN_SELECTED_RULES,
    SHOW_MODAL,
    UPDATE_NEW_RULE_VALUES,
    UPDATE_NEW_RULE_STATUS,
    SET_NEW_RULE_VALUES,
    geoStoreLoginSubmit,
    loginSuccess,
    loginFail,
    logout,
    geoStoreChangePassword,
    getGroups,
    getUsers,
    getWorkspaces,
    getLayers,
    getRules,
    updateRulesPage,
    updateRulesFiltersValues,
    rulesSelected,
    rulesUnSelected,
    cleanSelectedRules,
    showModal,
    updateNewRuleValues,
    updateNewRuleStatus,
    submitNewRule,
    setNewRuleValues,
    saveRule,
    deleteRules
};
