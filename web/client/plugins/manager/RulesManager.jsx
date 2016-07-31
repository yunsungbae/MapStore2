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

const {rulesSelected, loadRules, moveRules} = require('../../actions/rulesmanager');
const {rulesSelector} = require('../../selectors/rulesmanager');

const genericSelector = (state, name) => state.rulesmanager && state.rulesmanager[name];

const rulesManagerSelector = createSelector([
    rulesSelector,
    state => genericSelector(state, "rulesPage"),
    state => genericSelector(state, "rulesCount"),
    state => genericSelector(state, "selectedRules"),
    state => genericSelector(state, "rulesTableError")
], (rules, rulesPage, rulesCount, selectedRules, rulesTableError) => ({
    rules: rules,
    rulesPage: rulesPage,
    rulesCount: rulesCount,
    selectedRules: selectedRules,
    rulesTableError: rulesTableError
}));

const RulesManagerPlugin = connect(rulesManagerSelector, {
    onSelectRules: rulesSelected,
    moveRules: moveRules,
    loadRules: loadRules
})(require('../../components/manager/rulesmanager/RulesManager'));


module.exports = {
    RulesManagerPlugin: assign(RulesManagerPlugin, {
        hide: true,
        Manager: {
            id: "rulesmanager",
            name: 'rulesmanager',
            position: 2,
            title: 'Rules Manager'
        }
    }),
    reducers: {rulesmanager: require('../../reducers/rulesmanager')}
};
