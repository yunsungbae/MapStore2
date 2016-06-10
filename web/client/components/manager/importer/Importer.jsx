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
const ImportsGrid = require('./ImportsGrid');
const FileUploader = require('../../file/FileUploader');
const Task = require('./Task');
const Import = require('./Import');
const {Grid, Col, Row} = require('react-bootstrap');
const Importer = React.createClass({
    propTypes: {
        loading: React.PropTypes.bool,
        error: React.PropTypes.object,
        importCreationDefaults: React.PropTypes.object,
        uploading: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.object]),
        createImport: React.PropTypes.func,
        updateTask: React.PropTypes.func,
        loadImport: React.PropTypes.func,
        deleteImport: React.PropTypes.func,
        deleteTask: React.PropTypes.func,
        loadTask: React.PropTypes.func,
        uploadImportFiles: React.PropTypes.func,
        selectedImport: React.PropTypes.object,
        selectedTask: React.PropTypes.object,
        imports: React.PropTypes.array,
        onMount: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            importCreationDefaults: {
                "import": {
                    "targetWorkspace": {
                        "workspace": {
                            "name": "cite"
                        }
                    }
                }

            },
            createImport: () => {},
            loadImport: () => {},
            loadTask: () => {},
            uploadImportFiles: () => {},
            onMount: () => {},
            imports: []
        };
    },
    componentDidMount() {
        this.props.onMount();
    },
    renderLoading() {
        if (this.props.loading) {
            return <div style={{"float": "right"}}><Spinner noFadeIn spinnerName="circle"/></div>;
        }
        return null;
    },
    renderDetails() {
        if ( this.props.selectedImport && this.props.selectedTask) {
            return (<div>
            <ol className="breadcrumb">
              <li><a href="#" onClick={(e) => {e.preventDefault(); this.props.onMount(); }}><Message msgId="importer.imports" /></a></li>
              <li><a href="#" onClick={(e) => {e.preventDefault(); this.props.loadImport(this.props.selectedImport.id); }}>
                  <Message msgId="importer.importN" msgParams={{id: this.props.selectedImport.id}}/>
              </a></li>
              <li className="active">Task {this.props.selectedTask.id}</li>
            </ol>
            <h2>Import {this.props.selectedImport.id}</h2>
            <Task updateTask={this.props.updateTask.bind(null, this.props.selectedImport.id, this.props.selectedTask.id)} task={this.props.selectedTask}/>
            </div>);
        }
        if (this.props.selectedImport) {
            return (<div>
                <ol className="breadcrumb">
                  <li><a href="#" onClick={(e) => {e.preventDefault(); this.props.onMount(); }}><Message msgId="importer.importN" msgParams={{id: this.props.selectedImport.id}}/></a></li>
                  <li className="active"><Message msgId="importer.importN" msgParams={{id: this.props.selectedImport.id}}/></li>
                </ol>
                <Import deleteTask={this.props.deleteTask} deleteImport={this.props.deleteImport} loadTask={this.props.loadTask.bind(null, this.props.selectedImport.id)} import={this.props.selectedImport} />
                </div>);
        }
        return (<div>
                <ol className="breadcrumb">
                  <li className="active"><Message msgId="importer.imports" /></li>
                </ol>
                <ImportsGrid
                deleteImport={this.props.deleteImport}
                loadImport={this.props.loadImport}
                imports={this.props.imports} />
            </div>);
    },
    render() {
        let message = this.props.selectedImport ? "importer.dropfileImport" : "importer.dropfile";
        return (
            <Grid fluid>
                <Row>
                    <Col md={6}>
                    <FileUploader
                        dropZoneStyle={{
                            borderStyle: "dashed",
                            minHeight: "100px",
                            borderWidth: "3px",
                            verticalAlign: "middle",
                            transition: "all 0.3s ease-in-out"
                        }}
                        dropZoneActiveStyle={{
                            backgroundColor: "#eee",
                            borderWidth: "5px",
                            boxShadow: "0px 0px 25px 14px #d9edf7"

                        }}
                        beforeUploadMessage={<Message msgId="importer.creatingImportProcess" />}
                        dropMessage={<Message msgId={message} />}
                        uploading={this.props.uploading}
                        allowUpload={this.props.selectedImport}
                        onBeforeUpload={this.props.createImport.bind(null, this.props.importCreationDefaults)}
                        onUpload={this.props.uploadImportFiles.bind(null, this.props.selectedImport && this.props.selectedImport.id)} />
                    </Col>
                </Row>
                <Row>
                    {this.renderLoading()}
                    {this.renderDetails()}
                </Row>
            </Grid>);
    }
});
module.exports = Importer;
