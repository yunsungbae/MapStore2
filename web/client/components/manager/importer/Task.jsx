/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Grid, Col, Row, Panel, Label} = require('react-bootstrap');
const {DropdownList} = require('react-widgets');
const {Message} = require('../../I18N/Message');
const Layer = require('./Layer');

const Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object,
        updateTask: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            task: {},
            updateTask: () => {}
        };
    },
    getbsStyleForState(state) {
        switch (state) {
            case "READY":
                return "info";
            case "NO_FORMAT":
                return "danger";
            default:
                return "default";

        }
    },
    renderGeneral(task) {
        return (<dl className="dl-horizontal">
              <dt><Message msgId="importer.task.status" /></dt>
              <dd><Label bsStyle={this.getbsStyleForState(task.state)}>{task.state}</Label></dd>
              <dt><Message msgId="importer.task.updateMode" /></dt>
              <dd><DropdownList data={["APPEND", "CREATE", "REPLACE"]} value={task.updateMode} onChange={this.updateMode}/></dd>
            </dl>);
    },
    renderDataPanel(data) {
        return (<Panel bsStyle="info" header={<span><Message msgId="importer.task.originalData" /></span>}>
            <dl className="dl-horizontal">
              <dt><Message msgId="importer.task.file" /></dt>
              <dd>{data.file}</dd>
              <dt><Message msgId="importer.task.format" /></dt>
              <dd>{data.format}</dd>
            </dl>
        </Panel>);
    },
    renderTargetPanel(target) {
        return (<Panel bsStyle="info" header={<span><Message msgId="importer.task.targetStore" /></span>}>
            <dl className="dl-horizontal">
              <dt><Message msgId="importer.task.storeType" /></dt>
              <dd>{target.dataStore && target.dataStore.type}</dd>
              <dt><Message msgId="importer.task.storeName" /></dt>
              <dd>{target.dataStore && target.dataStore.name}</dd>
            </dl>
        </Panel>);
    },
    render() {
        return (
            <Panel header={<Message msgId="importer.task.panelTitle" msgParams={{id: this.props.task.id}} />} >
            <Grid fluid>
                <Row>
                    {this.renderGeneral(this.props.task)}
                </Row>
                <Row >
                    <Col lg={4} md={6} xs={12}>
                        {this.renderDataPanel(this.props.task.data)}
                    </Col>
                    <Col lg={4} md={6} xs={12}>
                        {this.renderTargetPanel(this.props.task.target)}
                    </Col>
                    <Col lg={4} md={6} xs={12}>
                        <Layer panProps={{bsStyle: "info"}} layer={this.props.task.layer}/>
                    </Col>
                </Row>
            </Grid>
            </Panel>
        );
    },
    updateMode(value) {
        this.props.updateTask({
            "updateMode": value
        });
    }
});
module.exports = Task;
