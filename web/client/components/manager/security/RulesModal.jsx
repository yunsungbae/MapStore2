/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Modal, Button} = require('react-bootstrap');
const Message = require('../../I18N/Message');
const Rule = require('./Rule');

const RulesModal = React.createClass({
    propTypes: {
        onSubmit: React.PropTypes.func,
        onClose: React.PropTypes.func,
        rules: React.PropTypes.array,
        modalTitleMsgId: React.PropTypes.string,
        submitButtonMsgId: React.PropTypes.string,
        closeButtonMsgId: React.PropTypes.string,
        loadGroups: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        services: React.PropTypes.object,
        options: React.PropTypes.object,
        updateRuleValues: React.PropTypes.func,
        ruleValues: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            onSubmit: () => {},
            onClose: () => {},
            rules: []
        };
    },
    render() {
        return (
            <Modal show={true} {...this.props} bsSize="small">
                <Modal.Header closeButton onHide={this.props.onClose}>
                    <Modal.Title>
                        <Message msgId={this.props.modalTitleMsgId}/>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Rule
                        loadGroups={this.props.loadGroups}
                        loadUsers={this.props.loadUsers}
                        loadWorkspaces={this.props.loadWorkspaces}
                        loadLayers={this.props.loadLayers}
                        services={this.props.services}
                        options={this.props.options}
                        updateRuleValues={this.props.updateRuleValues}
                        selectedValues={this.props.ruleValues}
                        showAccess={true}
                        containerClassName="modal-container"/>
                </Modal.Body>
                <Modal.Footer style={{'text-align': 'center'}}>
                    <Button bsSize="small" bsStyle="primary" onClick={this.props.onSubmit}>
                        <Message msgId={this.props.submitButtonMsgId}/>
                    </Button>
                    <Button bsSize="small" bsStyle="primary" onClick={this.props.onClose}>
                        <Message msgId={this.props.closeButtonMsgId}/>
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = RulesModal;
