/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Spinner = require('react-spinkit');
const Message = require('../../I18N/Message');
const ImporterUtils = require('../../../utils/ImporterUtils');
const {Grid, Row, Panel, Label, Table, Button, Glyphicon} = require('react-bootstrap');

const Task = React.createClass({
    propTypes: {
        "import": React.PropTypes.object,
        loadTask: React.PropTypes.func,
        runImport: React.PropTypes.func,
        deleteImport: React.PropTypes.func,
        deleteTask: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            "import": {},
            loadTask: () => {},
            runImport: () => {},
            deleteImport: () => {},
            deleteTask: () => {}
        };
    },
    getbsStyleForState(state) {
        return ImporterUtils.getbsStyleForState(state);
    },
    renderGeneral(importObj) {
        return (<dl className="dl-horizontal">
              <dt><Message msgId="importer.import.status" /></dt>
              <dd><Label bsStyle={this.getbsStyleForState(importObj.state)}>{importObj.state}</Label></dd>
              <dt><Message msgId="importer.import.archive" /></dt>
              <dd>{importObj.archive}</dd>
            </dl>);
    },
    renderTask(task) {

        return (<tr key={task && task.id}>
            <td><a onClick={(e) => {e.preventDefault(); this.props.loadTask(task.id); }} >{task.id}</a></td>
            <td><Label bsStyle={this.getbsStyleForState(task.state)}>{task.state}</Label>{this.renderLoadingTask(task)}</td>
            <td key="actions">
                <Button bsSize="xsmall" onClick={(e) => {e.preventDefault(); this.props.deleteTask(this.props.import.id, task.id); }}>
                    <Glyphicon glyph="remove"/>
                    <Message msgId="importer.import.delete" />
                </Button>
            </td>
        </tr>);
    },
    renderLoading() {
        if (this.props.import.loading) {
            return <div style={{"float": "left"}}><Spinner noFadeIn spinnerName="circle"/></div>;
        }
    },
    renderLoadingMessage(task) {
        switch (task.message) {
            case "applyPreset":
                return <Message msgId="importer.import.applyingPreset"/>;
            case "deleting":
                return <Message msgId="importer.import.deleting" />;
            case "analyzing":
                return <Message msgId="importer.import.analyzing" />;
            default:
                return null;
        }
    },
    renderLoadingTask(task) {
        if (task.loading) {
            return (<div style={{"float": "right"}}>
                {this.renderLoadingMessage(task)}
                <Spinner noFadeIn spinnerName="circle"/></div>);
        }
        return null;
    },
    render() {
        return (
            <Panel header={<span><Message msgId="importer.importN" msgParams={{id: this.props.import.id}}/>{this.renderLoading()}</span>} >
            <Grid fluid>
                <Row>
                    {this.renderGeneral(this.props.import)}
                </Row>
                <Row>
                    <h3><Message msgId="importer.import.tasks" /></h3>
                    <Table striped bordered condensed hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th><Message msgId="importer.import.status" /></th>
                            <th><Message msgId="importer.import.actions" /></th>
                          </tr>
                        </thead>
                        <tbody>
                            {this.props.import.tasks.map(this.renderTask)}
                        </tbody>
                    </Table>
                </Row>
                <Row style={{"float": "right"}}>
                    <Button bsStyle="success" onClick={() => {this.props.runImport(this.props.import.id); }}><Message msgId="importer.import.runImport" /></Button>&nbsp;
                    <Button bsStyle="danger" onClick={() => {this.props.deleteImport(this.props.import.id); }}><Message msgId="importer.import.deleteImport" /></Button>
                </Row>
            </Grid>
            </Panel>
        );
    }
});
module.exports = Task;
