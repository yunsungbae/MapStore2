/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {Grid, Col, Row, Panel, Label} = require('react-bootstrap');
const Spinner = require('react-spinkit');
const {DropdownList} = require('react-widgets');
const {Message} = require('../../I18N/I18N');
const Layer = require('./Layer');
const TransformsGrid = require('./TransformsGrid');

const Task = React.createClass({
    propTypes: {
        task: React.PropTypes.object,
        updateTask: React.PropTypes.func,
        loadTransform: React.PropTypes.func,
        deleteTransform: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            task: {},
            updateTask: () => {},
            loadTransform: () => {},
            deleteTransform: () => {}
        };
    },
    getbsStyleForState(state) {
        switch (state) {
            case "READY":
                return "info";
            case "NO_FORMAT":
            case "BAD_FORMAT":
                return "danger";
            default:
                return "default";

        }
    },
    renderLoading(element) {
        if (this.props.task.loading ) {
            if (!element) {
                return <Spinner spinnerName="circle" />;
            } else if (this.props.task.element === element) {
                return <Spinner spinnerName="circle" />;
            }
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
        return (<Panel bsStyle="info" header={<span><Message msgId="importer.task.targetStore" />{this.renderLoading("target")}</span>}>
            <dl className="dl-horizontal">
              <dt><Message msgId="importer.task.storeType" /></dt>
              <dd>{target.dataStore && target.dataStore.type || target.coverageStore && target.coverageStore.type}</dd>
              <dt><Message msgId="importer.task.storeName" /></dt>
              <dd>{target.dataStore && target.dataStore.name || target.coverageStore && target.coverageStore.name}</dd>
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
                        <Layer panProps={{bsStyle: "info" }} layer={this.props.task.layer}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <TransformsGrid
                            panProps={{bsStyle: "info" }}
                            transforms={this.props.task.transformChain && this.props.task.transformChain.transforms}
                            loadTransform={this.props.loadTransform}
                            deleteTransform={this.props.deleteTransform}
                            type={this.props.task.transformChain && this.props.task.transformChain.type}
                             />
                    </Col>
                </Row>
            </Grid>
            </Panel>
        );
    },
    updateMode(value) {
        this.props.updateTask( null, null, {
            "updateMode": value
        });
    }
});
module.exports = Task;
