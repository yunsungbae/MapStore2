/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Select = require('react-select');
const LocaleUtils = require('../../../utils/LocaleUtils');

require('react-select/dist/react-select.css');

const SearcheableSelect = React.createClass({
    propTypes: {
        loadOptions: React.PropTypes.func,
        onInputChange: React.PropTypes.func,
        onValueUpdated: React.PropTypes.func,
        options: React.PropTypes.array,
        placeholderMsgId: React.PropTypes.string,
        selectedValue: React.PropTypes.string,
        className: React.PropTypes.string
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            loadOptions: () => [],
            onInputChange: () => {},
            onValueUpdated: () => [],
            options: []
        };
    },
    getOptions() {
        return this.props.options.map(option => {
            return { value: option, label: option };
        });
    },
    render() {
        let selectedValue;
        if (this.props.selectedValue) {
            selectedValue = {
                'value': this.props.selectedValue,
                'label': this.props.selectedValue
            };
        }
        return (
            <Select className={this.props.className} onOpen={this.props.loadOptions}
                onInputChange={this.props.onInputChange}
                options={this.getOptions()}
                value={selectedValue}
                onChange={this.props.onValueUpdated}
                placeholder={LocaleUtils.getMessageById(this.context.messages, this.props.placeholderMsgId)}/>
        );
    }
});

module.exports = SearcheableSelect;
