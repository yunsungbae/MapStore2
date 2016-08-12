/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Glyphicon} = require('react-bootstrap');
const Dropzone = require('react-dropzone');
const Spinner = require('react-spinkit');
// const LocaleUtils = require('../../../utils/LocaleUtils');
const Message = require('../../../components/I18N/Message');
// const thumbUrl = require('../style/default.png');
// const assign = require('object-assign');
require('./css/thumbnail.css');
  /**
   * A Dropzone area for a Thumbnail.
   */
const Thumbnail = React.createClass({
    propTypes: {
        srcImg: React.PropTypes.string,
        glyphicon: React.PropTypes.string,
        style: React.PropTypes.object,
        loading: React.PropTypes.bool,
        map: React.PropTypes.object,
        // CALLBACKS
        onDrop: React.PropTypes.func,
        onCreateThumbnail: React.PropTypes.func,
        onDeleteThumbnail: React.PropTypes.func,
        onRemoveThumbnail: React.PropTypes.func,
        // I18N
        text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        text2: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            glyphicon: "remove-circle",
            // CALLBACKS
            onDrop: () => {},
            onRemoveThumbnail: () => {},
            onCreateThumbnail: () => {},
            onDeleteThumbnail: () => {},
            // I18N
            text: "Drop or click to import an image",
            text2: "(best 300px X 180px)"
        };
    },
    getInitialState() {
        let thumbnail = (this.props.map && this.props.map.thumbnail && this.props.map.thumbnail !== "NODATA" ) ? decodeURIComponent(this.props.map.thumbnail) : null;
        return {
            files: [],
            srcImg: thumbnail
        };
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.map && nextProps.map) {
            let thumbnail = (nextProps.map.thumbnail && this.props.map.thumbnail !== "NODATA" ) ? decodeURIComponent(nextProps.map.thumbnail) : null;
            if (this.props.map.thumbnail !== nextProps.map.thumbnail) {
                this.setState({
                    files: [],
                    srcImg: thumbnail
                });
            }

        }
    },
    onRemoveThumbnail(event) {
        event.stopPropagation();
        this.setState({
            files: [],
            srcImg: null
        });
    },
    getThumbnailUrl() {
        return this.state.srcImg === "NODATA" ? null : this.state.srcImg;
    },
    getFiles() {
        return this.state.files;
    },
    isImage(images) {
        return images[0].type === "image/png" || images[0].type === "image/jpeg" || images[0].type === "image/jpg";
    },
    onDrop(images) {
        const isImage = this.isImage(images);
        if (isImage) {
            this.setState({
                files: images,
                srcImg: images[0].preview
            });

            // update this.props.map.thumbnail
        } else {
            // reset image
            this.setState({
                files: []
            });
        }
    },
    generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); // use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    getDataUri(callback) {
        let filesSelected = this.getFiles();
        if (filesSelected.length > 0) {
            let fileToLoad = filesSelected[0];
            let fileReader = new FileReader();
            fileReader.onload = (event) => (callback(event.target.result));
            return fileReader.readAsDataURL(fileToLoad);
        }
        return callback(null);
    },
    updateThumbnail() {
        this.getDataUri((data) => {
            const name = this.generateUUID(); // create new unique name
            const category = "THUMBNAIL";

            // user removed the thumbnail (the original url is present but not the preview)
            if (this.props.map && !data && this.props.map.thumbnail && !this.refs.imgThumbnail) {
                this.deleteThumbnail(this.props.map.thumbnail, this.props.map.id);
                // TODO update map attribute

            // there is a thumbnail to upload
            } else if ( this.props.map && data && ( this.refs.imgThumbnail && this.refs.imgThumbnail.src !== decodeURIComponent(this.props.map.thumbnail) ) ) {
                // remove old one if present
                if (this.props.map.thumbnail) {
                    this.deleteThumbnail(this.props.map.thumbnail);
                }
                // create the new one (and update the thumbnail attribute)
                this.props.onCreateThumbnail(name, data, category, this.props.map.id);
            }
            return data;
        });
    },
    render() {
        const withoutThumbnail = (<div className="dropzone-content" >{this.props.text}<br/>{this.props.text2}</div>);
        return (
            (this.props.loading) ? (<div className="btn btn-info" style={{"float": "center"}}> <Spinner spinnerName="circle"/></div>) :
            (
                <div className="dropzone-thumbnail-container">
                    <label className="control-label"><Message msgId="map.thumbnail"/></label>
                    <Dropzone className="dropzone alert alert-info" rejectClassName="alert-danger" onDrop={this.onDrop}>
                    { (this.getThumbnailUrl() ) ?
                        (<div>
                            <img src={this.getThumbnailUrl()} ref="imgThumbnail"/>
                            <div className="dropzone-content-added">{this.props.text}<br/>{this.props.text2}</div>
                            <div className="dropzone-remove" onClick={this.onRemoveThumbnail}>
                                <Glyphicon glyph={this.props.glyphicon} />
                            </div>
                        </div>) : withoutThumbnail
                    }
                    </Dropzone>
                </div>
            )
        );
    },
    deleteThumbnail(thumbnail, mapId) {
        if (thumbnail && thumbnail.includes("geostore")) {
            // DELETE old thumbnail resource if no image is provided

            // this doesn't work if the url is not  URL encoded (because of GeoStore / Tomcat parameter encoding issues )
            let start = (thumbnail).indexOf("data%2F") + 7;
            let end = (thumbnail).indexOf("%2Fraw");
            let idThumbnail = thumbnail.slice(start, end);

            // delete the old thumbnail
            if (idThumbnail) {
                this.props.onDeleteThumbnail(idThumbnail, mapId);
            }
        }
    }
});

module.exports = Thumbnail;
