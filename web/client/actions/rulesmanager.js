/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const GeoServerAPI = require('../api/GeoServerDAO');

const axios = require('../libs/ajax');

const RULES_SELECTED = 'RULES_SELECTED';
const RULES_LOADED = 'RULES_SELECTED';
const RULES_TABLE_ERROR = 'RULES_TABLE_ERROR';

function rulesSelected(rules, merge, unselect) {
    return {
        type: RULES_SELECTED,
        rules: rules,
        merge: merge,
        unselect: unselect
    };
}

function rulesLoaded(rules, count, page) {
    return {
        type: RULES_SELECTED,
        rules: rules,
        count: count,
        page: page
    };
}

function rulesTableError(error) {
    return {
        type: RULES_TABLE_ERROR,
        error: error
    };
}

function loadRules(page) {
    return (dispatch) => {
        axios.all([GeoServerAPI.loadRules(page), GeoServerAPI.getRulesCount()])
            .then(axios.spread((rules, count) => {
                dispatch(rulesLoaded(rules, count, page));
            })).catch(error => {
                dispatch(rulesTableError(error));
            }
        );
    };
}

function moveRules(targetPriority, rules) {
    return (dispatch, getSate) => {
        GeoServerAPI.moveRules(targetPriority, rules).then(() => {
            const state = getSate().rulesmanager || {};
            loadRules(state.rulesPage || 1);
        }).catch(error => {
            dispatch(rulesTableError(error));
        });
    };
}

module.exports = {
    RULES_SELECTED,
    RULES_LOADED,
    RULES_TABLE_ERROR,
    rulesSelected,
    loadRules,
    moveRules
};
