/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Filters = require('./Filters');
const Rules = require('./Rules');
const RulesModal = require('./RulesModal');

const {Table} = require('react-bootstrap');

require('./Security.css');

const Security = React.createClass({
    propTypes: {
        getRules: React.PropTypes.func,
        updateRulesPage: React.PropTypes.func,
        loadGroups: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        updateFiltersValues: React.PropTypes.func,
        services: React.PropTypes.object,
        filtersValues: React.PropTypes.object,
        options: React.PropTypes.object,
        rulesCount: React.PropTypes.number,
        rules: React.PropTypes.array,
        rulesPage: React.PropTypes.number,
        rulesSelected: React.PropTypes.func,
        rulesUnSelected: React.PropTypes.func,
        cleanSelectedRules: React.PropTypes.func,
        selectedRules: React.PropTypes.object,
        showModal: React.PropTypes.func,
        modalToShow: React.PropTypes.string,
        submitNewRule: React.PropTypes.func,
        updateNewRuleValues: React.PropTypes.func,
        newRuleValues: React.PropTypes.object,
        newRuleStatus: React.PropTypes.object,
        updateNewRuleStatus: React.PropTypes.func,
        setNewRuleValues: React.PropTypes.func,
        saveRule: React.PropTypes.func,
        deleteRules: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            getRules: () => {},
            updateRulesPage: () => {},
            updateNewRuleValues: () => {},
            newRuleStatus: {'status': undefined},
            updateNewRuleStatus: () => {},
            setNewRuleValues: () => {},
            saveRule: () => {}
        };
    },
    componentWillReceiveProps(newProps) {
        if (newProps.newRuleStatus && newProps.newRuleStatus.status === 'success'
            && newProps.newRuleStatus.status !== this.props.newRuleStatus.status) {
            this.closeModal();
            this.props.getRules();
            this.props.updateRulesPage(1);
            this.props.cleanSelectedRules();
        }
    },
    render() {
        return (
            <div>
                <Filters
                    loadGroups={this.props.loadGroups}
                    loadUsers={this.props.loadUsers}
                    loadWorkspaces={this.props.loadWorkspaces}
                    loadLayers={this.props.loadLayers}
                    services={this.props.services}
                    updateFiltersValues={this.props.updateFiltersValues}
                    filtersValues={this.props.filtersValues}
                    options={this.props.options}/>
                <Rules
                    getRules={this.props.getRules}
                    updateRulesPage={this.props.updateRulesPage}
                    filtersValues={this.props.filtersValues}
                    rules={this.props.rules}
                    rulesCount={this.props.rulesCount}
                    rulesPage={this.props.rulesPage}
                    rulesSelected={this.props.rulesSelected}
                    rulesUnSelected={this.props.rulesUnSelected}
                    cleanSelectedRules={this.props.cleanSelectedRules}
                    selectedRules={this.props.selectedRules}
                    showModal={this.props.showModal}
                    setNewRuleValues={this.props.setNewRuleValues}
                    deleteRules={this.props.deleteRules}/>
                {
                    this.props.modalToShow === 'ADD_RULE_MODAL' &&
                    <RulesModal
                        onSubmit={this.props.submitNewRule}
                        onClose={this.closeModal}
                        modalTitleMsgId={'security.newRuleModalTitle'}
                        submitButtonMsgId={'security.createNewRuleButton'}
                        closeButtonMsgId={'security.closeModalButton'}loadGroups={this.props.loadGroups}
                        loadUsers={this.props.loadUsers}
                        loadWorkspaces={this.props.loadWorkspaces}
                        loadLayers={this.props.loadLayers}
                        services={this.props.services}
                        updateRuleValues={this.props.updateNewRuleValues}
                        ruleValues={this.props.newRuleValues}
                        options={this.props.options}/>
                }
                {
                    this.props.modalToShow === 'EDIT_RULE_MODAL' &&
                    <RulesModal
                        onSubmit={this.props.saveRule}
                        onClose={this.closeModal}
                        modalTitleMsgId={'security.editRuleModalTitle'}
                        submitButtonMsgId={'security.editRuleButton'}
                        closeButtonMsgId={'security.closeModalButton'}loadGroups={this.props.loadGroups}
                        loadUsers={this.props.loadUsers}
                        loadWorkspaces={this.props.loadWorkspaces}
                        loadLayers={this.props.loadLayers}
                        services={this.props.services}
                        updateRuleValues={this.props.updateNewRuleValues}
                        ruleValues={this.props.newRuleValues}
                        options={this.props.options}/>
                }
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <input type="checkbox" checked={true} onChange={() => {}}/>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    },
    closeModal() {
        this.props.setNewRuleValues();
        this.props.showModal(undefined);
        this.props.updateNewRuleStatus({'status': undefined});
    }
});

module.exports = Security;
