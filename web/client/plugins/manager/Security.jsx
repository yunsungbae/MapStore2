/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const assign = require('object-assign');
const {connect} = require('react-redux');
const {createSelector} = require('reselect');
const {getGroups, getUsers, getWorkspaces, getRules, getLayers,
       updateRulesPage, updateRulesFiltersValues, rulesSelected,
       rulesUnselected, cleanSelectedRules, showModal, updateNewRuleValues,
       submitNewRule, updateNewRuleStatus, setNewRuleValues, saveRule, deleteRules} = require('../../actions/security');
const {groupsNamesSelector, usersNamesSelector, workspacesNamesSelector,
       layersNamesSelector, rulesSelector} = require('../../selectors/security');

const securitySelector = createSelector([
    groupsNamesSelector,
    usersNamesSelector,
    workspacesNamesSelector,
    layersNamesSelector,
    rulesSelector,
    (state) => state.security && state.security.rulesCount,
    (state) => state.security && state.security.rulesPage,
    (state) => state.security && state.security.rulesFiltersValues,
    (state) => state.security && state.security.selectedRules,
    (state) => state.security && state.security.modalToShow,
    (state) => state.security && state.security.newRuleValues,
    (state) => state.security && state.security.newRuleStatus
], (groups, users, workspaces, layers, rules, rulesCount, rulesPage,
    rulesFiltersValues, selectedRules, modalToShow, newRuleValues,
    newRuleStatus) => ({
    options: {
        'user': users,
        'group': groups,
        'workspace': workspaces,
        'layer': layers
    },
    rules: rules,
    rulesCount: rulesCount,
    rulesPage: rulesPage,
    filtersValues: rulesFiltersValues,
    selectedRules: selectedRules,
    modalToShow: modalToShow,
    newRuleValues: newRuleValues,
    newRuleStatus: newRuleStatus
}));

const SecurityPlugin = connect(securitySelector, {
    getRules: getRules,
    loadGroups: getGroups,
    loadUsers: getUsers,
    loadWorkspaces: getWorkspaces,
    loadLayers: getLayers,
    updateRulesPage: updateRulesPage,
    updateFiltersValues: updateRulesFiltersValues,
    rulesSelected: rulesSelected,
    rulesUnselected: rulesUnselected,
    cleanSelectedRules: cleanSelectedRules,
    showModal: showModal,
    submitNewRule: submitNewRule,
    updateNewRuleValues: updateNewRuleValues,
    updateNewRuleStatus: updateNewRuleStatus,
    setNewRuleValues: setNewRuleValues,
    saveRule: saveRule,
    deleteRules: deleteRules
})(require('../../components/manager/security/Security'));


module.exports = {
    SecurityPlugin: assign(SecurityPlugin, {
        hide: true,
        Manager: {
            id: "security",
            name: 'security',
            position: 2,
            title: 'Security Rules'
        }
    }),
    reducers: {importer: require('../../reducers/security')}
};
