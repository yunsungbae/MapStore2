/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const assign = require('object-assign');

const { RULES_SELECTED, RULES_LOADED, RULES_TABLE_ERROR } = require('../actions/rulesmanager');
const _ = require('lodash');

function rulesmanager(state = {}, action) {
    switch (action.type) {
        case RULES_SELECTED: {
            if (action.merge) {
                return assign({}, state, {
                    selectedRules: action.rules
                });
            }
            const newRules = action.rules || [];
            const existingRules = state.selectedRules || [];
            if (action.unselect) {
                return assign({}, state, {
                    selectedRules: (existingRules).filter(
                        rule => !newRules.find(unselected => unselected.id === rule.id)).value()
                });
            }
            return assign({}, state, {
                selectedRules: _(existingRules).concat(newRules).uniq(rule => rule.id).value()
            });
        }
        case RULES_LOADED: {
            return assign({}, state, {
                rules: action.rules,
                rulesCount: action.count,
                rulesPage: action.page,
                selectedRules: [],
                rulesTableError: undefined
            });
        }
        case RULES_TABLE_ERROR: {
            return assign({}, state, {
                rulesTableError: action.error
            });
        }
        default:
            return state;
    }
}

module.exports = rulesmanager;
