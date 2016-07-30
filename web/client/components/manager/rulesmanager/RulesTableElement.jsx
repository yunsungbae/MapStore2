/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const SortableMixin = require('react-sortable-items/SortableItemMixin');

const RulesTableElement = React.createClass({
    propTypes: {
        onSelect: React.PropTypes.func,
        rule: React.PropTypes.object,
        checked: React.PropTypes.bool
    },
    mixins: [SortableMixin],
    getDefaultProps() {
        return {
            onSelect: () => [],
            rule: () => {},
            checked: false
        };
    },
    render() {
        return this.renderWithSortable(
            <tr className={this.props.checked ? "rule-selected" : "rule"}>
                <td>
                    <input
                        type="checkbox"
                        checked={this.props.checked}
                        onChange={() => this.props.onSelect(this.props.rule, true, this.props.checked)}/>
                </td>
                <td>this.props.rule.roleName</td>
                <td>this.props.rule.userName</td>
                <td>this.props.rule.service</td>
                <td>this.props.rule.request</td>
                <td>this.props.rule.workspace</td>
                <td>this.props.rule.layer</td>
                <td>this.props.rule.access</td>
            </tr>
        );
    }
});

module.exports = RulesTableElement;
