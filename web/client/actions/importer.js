/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var API = require('../api/geoserver/Importer');
const _ = require('lodash');
const assign = require('object-assign');
const IMPORTS_LOADING = 'IMPORTS_LOADING';
const IMPORTS_CREATION_ERROR = 'IMPORTS_CREATION_ERROR';
const IMPORT_CREATED = 'IMPORT_CREATED';

const IMPORTS_TASK_CREATED = 'IMPORTS_TASK_CREATED';
const IMPORTS_TASK_LOADED = 'IMPORTS_TASK_LOADED';
const IMPORTS_TASK_LOAD_ERROR = 'IMPORTS_TASK_LOAD_ERROR';
const IMPORTS_TASK_UPDATED = 'IMPORT_TASK_UPDATED';
const IMPORTS_TASK_DELETE = 'IMPORT_TASK_DELETE';
const IMPORTS_TASK_CREATION_ERROR = 'IMPORTS_TASK_CREATION_ERROR';

const IMPORTS_FILE_UPLOADED = 'IMPORTS_FILE_UPLOADED';
const IMPORTS_UPLOAD_PROGRESS = 'IMPORTS_UPLOAD_PROGRESS';

const IMPORTS_LIST_LOADED = 'IMPORTS_LIST_LOADED';
const IMPORTS_LIST_LOAD_ERROR = 'IMPORTS_LIST_LOAD_ERROR';

const IMPORT_LOADED = 'IMPORT_LOADED';
const IMPORT_LOAD_ERROR = 'IMPORT_LOAD_ERROR';
const IMPORT_DELETE = 'IMPORT_DELETE';
const IMPORT_DELETE_ERROR = 'IMPORT_DELETE_ERROR';
/*******************/
/* UTILITY         */
/*******************/
const getAuthOptionsFromState = function(state, baseParams = {}) {
    let authHeader = state && state.security && state.security.authHeader;
    if (authHeader) {
        return _.merge({
            // TODO support deep merge of attributes
            headers: {
                'Authorization': authHeader
            }
        }, baseParams);
    }
    return baseParams;

};
/*******************/
/* ACTION CREATORS */
/*******************/

function loading(details) {
    return {
        type: IMPORTS_LOADING,
        details: details
    };
}
function loadError(e) {
    return {
        type: IMPORTS_LIST_LOAD_ERROR,
        error: e
    };
}
function importCretationError(e) {
    return {
        type: IMPORTS_CREATION_ERROR,
        error: e
    };
}
function importCreated(importObj) {
    return {
        type: IMPORT_CREATED,
        "import": importObj
    };
}

function importTaskCreated(tasks) {
    return {
        type: IMPORTS_TASK_CREATED,
        tasks: tasks
    };
}
function importTaskUpdated(task, importId, taskId) {
    return {
        type: IMPORTS_TASK_UPDATED,
        task,
        importId,
        taskId
    };
}

function importTaskDeleted(importId, taskId) {
    return {
        type: IMPORTS_TASK_DELETE,
        importId,
        taskId
    };
}


function importTaskLoaded(task) {
    return {
        type: IMPORTS_TASK_LOADED,
        task: task
    };
}
function importTaskLoadError(e) {
    return {
        type: IMPORTS_TASK_LOAD_ERROR,
        task: e
    };
}
function importTaskCreationError(e) {
    return {
        type: IMPORTS_TASK_CREATION_ERROR,
        error: e
    };
}

function importsLoaded(imports) {
    return {
        type: IMPORTS_LIST_LOADED,
        imports: imports
    };
}

function importLoaded(importObj) {
    return {
        type: IMPORT_LOADED,
        "import": importObj
    };
}
function importLoadError(e) {
    return {
        type: IMPORT_LOAD_ERROR,
        "error": e
    };
}

function importDeleted(id) {
    return {
        type: IMPORT_DELETE,
        id: id
    };
}

function importDeleteError(e) {
    return {
        type: IMPORT_DELETE_ERROR,
        "error": e
    };
}

function fileUploaded(files) {
    return {
        type: IMPORTS_FILE_UPLOADED,
        "files": files
    };
}

function uploadProgress(progress) {
    return {
        type: IMPORTS_UPLOAD_PROGRESS,
        progress: progress
    };
}
/*******************/
/* DISPATCHERS     */
/*******************/
function createImport(geoserverRestURL, body = {}) {
    return (dispatch, getState) => {
        dispatch(loading());
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.createImport(geoserverRestURL, body, authOpts).then((response) => {
            dispatch(importCreated(response && response.data && response.data.import));
        }).catch((e) => {
            dispatch(importCretationError(e));
        });
    };
}
function loadImports(geoserverRestURL) {
    return (dispatch, getState) => {
        dispatch(loading());
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.getImports(geoserverRestURL, authOpts).then((response) => {
            dispatch(importsLoaded(response && response.data && response.data.imports));
        }).catch((e) => {
            dispatch(loadError(e));
        });
    };
}

function loadImport(geoserverRestURL, importId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.loadImport(geoserverRestURL, importId, authOpts).then((response) => {
            dispatch(importLoaded(response && response.data && response.data.import));
        }).catch((e) => {
            dispatch(importLoadError(e));
        });
    };
}
function deleteImport(geoserverRestURL, importId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.deleteImport(geoserverRestURL, importId, authOpts).then(() => {
            dispatch(importDeleted(importId));
        }).catch((e) => {
            dispatch(importDeleteError(e));
        });
    };
}

function loadTask(geoserverRestURL, importId, taskId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.loadTask(geoserverRestURL, importId, taskId, authOpts).then((response) => {
            dispatch(importTaskLoaded(response && response.data && response.data.task));
        }).catch((e) => {
            dispatch(importTaskLoadError(e));
        });
    };
}
function updateTask(geoserverRestURL, importId, taskId, body) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.updateTask(geoserverRestURL, importId, taskId, body, authOpts).then((response) => {
            dispatch(importTaskUpdated(response && response.data && response.data.task, importId, taskId));
        });
    };
}
function deleteTask(geoserverRestURL, importId, taskId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.deleteTask(geoserverRestURL, importId, taskId, authOpts).then(() => {
            dispatch(importTaskDeleted(importId, taskId));
        });
    };
}

function uploadImportFiles(geoserverRestURL, importId, files) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, uploadingFiles: files}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        let progressOpts = {
            progress: (progressEvent) => {
                dispatch(uploadProgress(progressEvent.loaded / progressEvent.total));
            }
        };
        let opts = assign(authOpts, progressOpts);
        API.uploadImportFiles(geoserverRestURL, importId, files, opts).then((response) => {
            let tasks = response && response.data && response.data.tasks || response && response.data && [response.data.task];
            dispatch(fileUploaded(files));
            dispatch(importTaskCreated(tasks));
            let impState = getState().importer;
            if (impState && impState.selectedImport && impState.selectedImport.id === importId && tasks && tasks.length > 1) {
                dispatch(loadImport(geoserverRestURL, importId));
            }
            /* TODO apply presets
            if (presets && response.data && response.data.tasks) {
                response.data.tasks.forEach((task) => {
                    presets.forEach((preset) => {
                        if(preset.match(task)){

                        }
                    })
                })
            }
            */
        }).catch((e) => {
            dispatch(importTaskCreationError(e));
        });
    };
}

module.exports = {createImport, uploadImportFiles, updateTask, deleteTask, loadImports, loadImport, deleteImport, loadTask,
    IMPORTS_LOADING,
    IMPORTS_LIST_LOADED,
    IMPORTS_LIST_LOAD_ERROR,
    IMPORT_CREATED,
    IMPORT_LOADED,
    IMPORT_DELETE,
    IMPORTS_TASK_CREATED,
    IMPORTS_TASK_CREATION_ERROR,
    IMPORTS_TASK_LOADED,
    IMPORTS_TASK_UPDATED,
    IMPORTS_TASK_DELETE,
    IMPORTS_FILE_UPLOADED,
    IMPORTS_UPLOAD_PROGRESS
};
