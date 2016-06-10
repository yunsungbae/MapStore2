/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const axios = require('../../libs/ajax');


var Api = {
    getImports: function(geoserverBaseUrl, options) {
        let url = geoserverBaseUrl + "imports";
        return axios.get(url, options);
    },
    createImport: function(geoserverBaseUrl, body, options) {
        let url = geoserverBaseUrl + "imports";
        return axios.post(url, body, options);
    },
    uploadImportFiles: function(geoserverBaseUrl, importId, files = [], options) {
        let url = geoserverBaseUrl + "imports/" + importId + "/tasks";
        let data = new FormData();
        files.forEach((file) => {data.append(file.name, file); });
        return axios.post(url, data, options);
    },
    loadImport: function(geoserverBaseUrl, importId, options) {
        let url = geoserverBaseUrl + "imports/" + importId;
        return axios.get(url, options);
    },
    updateTask: function( geoserverBaseUrl, importId, taskId, body, options) {
        let url = geoserverBaseUrl + "imports/" + importId + "/tasks/" + taskId;
        return axios.put(url, { task: body}, options);
    },
    loadTask: function( geoserverBaseUrl, importId, taskId, options) {
        let url = geoserverBaseUrl + "imports/" + importId + "/tasks/" + taskId;
        return axios.get(url, options);
    },
    deleteImport: function(geoserverBaseUrl, importId, options) {
        let url = geoserverBaseUrl + "imports/" + importId;
        return axios.delete(url, options);
    },
    deleteTask: function(geoserverBaseUrl, importId, taskId, options) {
        let url = geoserverBaseUrl + "imports/" + importId + "/tasks/" + taskId;
        return axios.delete(url, options);
    }
};

module.exports = Api;
