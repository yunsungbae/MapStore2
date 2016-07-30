/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Panel, Pagination, Button, Glyphicon} = require('react-bootstrap');
const {BootstrapTable, TableHeaderColumn} = require('react-bootstrap-table');

const filters = ['group', 'user', 'service', 'request', 'workspace', 'layer'];

require('react-bootstrap-table/css/react-bootstrap-table.min.css');

const Rules = React.createClass({
    propTypes: {
        getRules: React.PropTypes.func,
        updateRulesPage: React.PropTypes.func,
        rules: React.PropTypes.array,
        rulesCount: React.PropTypes.number,
        rulesPage: React.PropTypes.number,
        filtersValues: React.PropTypes.object,
        rulesSelected: React.PropTypes.func,
        rulesUnSelected: React.PropTypes.func,
        cleanSelectedRules: React.PropTypes.func,
        selectedRules: React.PropTypes.object,
        showModal: React.PropTypes.func,
        setNewRuleValues: React.PropTypes.func,
        deleteRules: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            getRules: () => {},
            updateRulesPage: () => {},
            rules: [],
            rulesCount: 0,
            rulesPage: 1,
            filtersValues: {},
            rulesSelected: () => {},
            rulesUnSelected: () => {},
            cleanSelectedRules: () => {},
            selectedRules: {},
            showModal: () => {},
            setNewRuleValues: () => {},
            deleteRules: () => {}
        };
    },
    componentDidMount() {
        this.props.getRules();
        this.props.cleanSelectedRules();
    },
    componentWillReceiveProps(newProps) {
        const filtersUpdated = !filters.every(
            filter => this.props.filtersValues[filter] === newProps.filtersValues[filter]);
        const newPage = this.props.rulesPage !== newProps.rulesPage;
        if (filtersUpdated && !newPage && this.props.rulesPage !== 1) {
            this.props.updateRulesPage(1);
        } else if (filtersUpdated || newPage) {
            this.props.getRules();
            this.props.cleanSelectedRules();
        }
    },
    render() {
        const selectedRulesKeys = this.props.selectedRules.map(rule => rule.id);
        const selectRowProp = {
          mode: "checkbox",
          clickToSelect: true,
          bgColor: "rgb(230, 243, 255)",
          onSelect: this.handleOnSelect,
          onSelectAll: this.handleOnSelectAll,
          selected: selectedRulesKeys
        };
        const numberOfPages = Math.ceil(this.props.rulesCount / 10);
        return (
            <Panel header="Rules" className="rules-container">
                <div className="rules-buttons">
                    <Button bsSize="small" bsStyle="primary" onClick={
                            () => this.props.showModal('ADD_RULE_MODAL')}>
                        <Glyphicon glyph="plus"/>
                    </Button>
                    { this.props.selectedRules.length > 0 &&
                        <Button bsSize="small" bsStyle="primary" onClick={
                            () => this.props.deleteRules(this.props.selectedRules.map(rule => rule.id))}>
                            <Glyphicon glyph="minus"/>
                        </Button>
                    }
                    { this.props.selectedRules.length === 1 &&
                        <Button bsSize="small" bsStyle="primary" onClick={
                                () => {
                                    const ruleToEdit = this.props.selectedRules[0];
                                    this.props.setNewRuleValues(this.ruleToRuleValues(ruleToEdit));
                                    this.props.showModal('EDIT_RULE_MODAL');
                                }
                        }>
                            <Glyphicon glyph="pencil"/>
                        </Button>
                    }
                </div>
                <BootstrapTable className="rules-tables" data={this.props.rules} selectRow={selectRowProp}>
                  <TableHeaderColumn dataField="id" isKey={true} hidden={true}/>
                  <TableHeaderColumn dataField="priority" dataSort={true} hidden={true}/>
                  <TableHeaderColumn dataField="roleName">Group</TableHeaderColumn>
                  <TableHeaderColumn dataField="userName">User</TableHeaderColumn>
                  <TableHeaderColumn dataField="service">Service</TableHeaderColumn>
                  <TableHeaderColumn dataField="request">Request</TableHeaderColumn>
                  <TableHeaderColumn dataField="workspace">WorkSpace</TableHeaderColumn>
                  <TableHeaderColumn dataField="layer">Layer</TableHeaderColumn>
                  <TableHeaderColumn dataField="access">Access</TableHeaderColumn>
                </BootstrapTable>
                <div className="rules-pagination">
                    <Pagination
                        bsSize="small"
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        items={numberOfPages}
                        maxButtons={3}
                        activePage={this.props.rulesPage}
                        onSelect={this.handlePageChange}/>
                </div>
            </Panel>
        );
    },
    handlePageChange(event, selectEvent) {
        this.props.updateRulesPage(selectEvent.eventKey);
    },
    handleOnSelectAll(isSelected, rules) {
        if (isSelected) {
            this.props.rulesSelected(rules);
        } else {
            this.props.cleanSelectedRules();
        }
    },
    handleOnSelect(rule, isSelected) {
        this.handleOnSelectAll(isSelected, [rule]);
    },
    ruleToRuleValues(rule) {
        return {
            'id': rule.id,
            'user': rule.userName === '*' ? undefined : rule.userName,
            'group': rule.roleName === '*' ? undefined : rule.roleName,
            'service': rule.service === '*' ? undefined : rule.service,
            'request': rule.request === '*' ? undefined : rule.request,
            'workspace': rule.workspace === '*' ? undefined : rule.workspace,
            'layer': rule.layer === '*' ? undefined : rule.layer,
            'access': rule.access
        };
    },
    deleteSelectedRules() {

    }
});

module.exports = Rules;
