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

const IMPORTS_TRANSFORM_LOAD = 'IMPORTS_TRANSFORM_LOAD';
const IMPORTS_TRANSFORM_LOAD_ERROR = 'IMPORTS_TRANSFORM_LOAD_ERROR';

const IMPORTS_TRANSFORM_DELETE = 'IMPORTS_TRANSFORM_DELETE';
const IMPORTS_TRANSFORM_UPDATED = 'IMPORTS_TRANSFORM_UPDATED';

const IMPORTS_FILE_UPLOADED = 'IMPORTS_FILE_UPLOADED';
const IMPORTS_UPLOAD_PROGRESS = 'IMPORTS_UPLOAD_PROGRESS';

const IMPORTS_LIST_LOADED = 'IMPORTS_LIST_LOADED';
const IMPORTS_LIST_LOAD_ERROR = 'IMPORTS_LIST_LOAD_ERROR';

const IMPORT_LOADED = 'IMPORT_LOADED';
const IMPORT_LOAD_ERROR = 'IMPORT_LOAD_ERROR';
const IMPORT_RUN_SUCCESS = 'IMPORT_RUN_SUCCESS';
const IMPORT_RUN_ERROR = 'IMPORT_RUN_ERROR';
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
/**
 * Check if task matches with the preset.
 * The match is by state, data.file.format and data.file.name
 * (also regex allowed for file name).
 */
const matchPreset = function(preset, task) {
    if (preset.state && preset.state !== task.state) {
        return false;
    }
    if (preset.data && task.data) {
        if (preset.data.format && preset.data.format !== task.data.format) {
            return false;
        }
        if (preset.data.file && preset.data.file !== task.data.file) {
            try {
                let patt = new RegExp(preset.data.file);
                if (!patt.test(task.data.file)) {
                    return false;
                }
            } catch(e) {
                return false;
            }

        }
    }
    return true;
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

/** IMPORT **/
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

function importRunSuccess(importId) {
    return {
        type: IMPORT_RUN_SUCCESS,
        importId
    };
}

function importRunError(importId, error) {
    return {
        type: IMPORT_RUN_ERROR,
        importId,
        error
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

/** TASKS **/

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
/** TRANSFORMS **/
function transformLoaded(importId, taskId, transformId, transform) {
    return {
        type: IMPORTS_TRANSFORM_LOAD,
        importId,
        taskId,
        transformId,
        transform
    };
}
function transformLoadError(importId, taskId, transformId, error) {
    return {
        type: IMPORTS_TRANSFORM_LOAD_ERROR,
        importId,
        taskId,
        transformId,
        error
    };
}
function transformDeleted(importId, taskId, transformId) {
    return {
        type: IMPORTS_TRANSFORM_DELETE,
        importId,
        taskId,
        transformId
    };
}
function transformUpdated(importId, taskId, transformId, transform) {
    return {
        type: IMPORTS_TRANSFORM_UPDATED,
        importId,
        taskId,
        transformId,
        transform
    };
}
/** FILE UPLOAD **/
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

/** IMPORT **/
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
        dispatch(loading({importId: importId, message: "deleting"}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.deleteImport(geoserverRestURL, importId, authOpts).then(() => {
            dispatch(importDeleted(importId));
        }).catch((e) => {
            dispatch(importDeleteError(e));
        });
    };
}

function runImport(geoserverRestURL, importId) {
    return (dispatch, getState) => {
        dispatch(loading({importId}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        API.runImport(geoserverRestURL, importId, authOpts).then(() => {
            dispatch(importRunSuccess(importId));
            if (getState && getState().selectedImport && getState().selectedImport.id === importId) {
                loadImport(geoserverRestURL, importId);
            } else {
                loadImports(geoserverRestURL);
            }
        }).catch((e) => {importRunError(importId, e); });
    };
}

/** TASKS **/
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
function updateTask(geoserverRestURL, importId, taskId, body, element) {
    return (dispatch, getState) => {
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.updateTask(geoserverRestURL, importId, taskId, element, body, authOpts).then((response) => {
            dispatch(importTaskUpdated(response && response.data && response.data.task, importId, taskId));
            let {selectedImport, selectedTask} = getState && getState().importer;
            if (selectedImport && selectedTask ) {
                dispatch(loadTask(geoserverRestURL, selectedImport.id, selectedTask.id));
            } else if ( selectedImport) {
                dispatch(loadImport(geoserverRestURL, selectedImport.id));
            } else {
                dispatch(loadImports(geoserverRestURL));
            }
        });
    };
}
function deleteTask(geoserverRestURL, importId, taskId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId, message: "deleting"}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.deleteTask(geoserverRestURL, importId, taskId, authOpts).then(() => {
            dispatch(importTaskDeleted(importId, taskId));
        });
    };
}
/** TRANFORMS **/
function loadTransform(geoserverRestURL, importId, taskId, transformId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId, transformId: transformId, message: "loading"}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.loadTransform(geoserverRestURL, importId, taskId, transformId, authOpts).then((response) => {
            let transform = response && response.data;
            dispatch(transformLoaded(importId, taskId, transformId, transform));
        }).catch((e) => {transformLoadError(importId, taskId, transformId, e); });
    };
}
function deleteTransform(geoserverRestURL, importId, taskId, transformId) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId, transformId: transformId, message: "loading"}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.deleteTransform(geoserverRestURL, importId, taskId, transformId, authOpts).then(() => {
            dispatch(transformDeleted(importId, taskId, transformId));
            let state = getState().importer;
            if (state.selectedTask && state.selectedTask.id === taskId) {
                dispatch(loadTask(geoserverRestURL, importId, taskId));
            }
        }).catch((e) => {transformLoadError(importId, taskId, transformId, e); }); // TODO transform delete error
    };
}

function updateTransform(geoserverRestURL, importId, taskId, transformId, transform) {
    return (dispatch, getState) => {
        dispatch(loading({importId: importId, taskId: taskId, transformId: transformId, message: "loading"}));
        let authOpts = getAuthOptionsFromState(getState && getState());
        return API.updateTransform(geoserverRestURL, importId, taskId, transformId, transform, authOpts).then((response) => {
            dispatch(transformUpdated(importId, taskId, transformId, response && response.data));
        }).catch((e) => {transformLoadError(importId, taskId, transformId, e); }); // TODO transform update error
    };
}
/** PRESETS **/
function applyPreset(geoserverRestURL, importId, task, preset) {

    return (dispatch, getState) => {
        const applyChange = (element, change) => { // TODO better as an action
            dispatch(updateTask(geoserverRestURL, importId, task.id, change, element));
        };
        if (preset.changes) {
            // update target, layer
            Object.keys(preset.changes).forEach((element) => {
                let values = preset.changes[element];
                dispatch(loading({importId: importId, taskId: task.id, element, message: "applyPreset"}));
                if (Array.isArray(values)) {
                    values.forEach(applyChange.bind(null, element));
                } else {
                    applyChange(element, values);
                }
            });
        }
        if (preset.transforms) {
            preset.transforms.forEach( (transform) => {
                let authOpts = getAuthOptionsFromState(getState && getState());
                API.addTransform(geoserverRestURL, importId, task.id, transform, authOpts);
            });
        }
    };
}
function applyPresets(geoserverRestURL, importId, tasks, presets) {
    return (dispatch, getState) => {
        if (tasks) {
            tasks.forEach( (task) => {
                presets.forEach( (preset) => {
                    if (task.data) {
                        if (matchPreset(preset, task)) {
                            dispatch(applyPreset(geoserverRestURL, importId, task, preset));
                        }
                    } else {
                        let authOpts = getAuthOptionsFromState(getState && getState());
                        API.loadTask(geoserverRestURL, importId, task.id, authOpts).then((response) => {
                            let completeTask = response && response.data && response.data.task;
                            if (matchPreset(preset, completeTask)) {
                                dispatch(applyPreset(geoserverRestURL, importId, completeTask, preset));
                            }
                        });
                    }

                });
            });
        }
    };
}

/** UPLOAD **/
function uploadImportFiles(geoserverRestURL, importId, files, presets) {
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
            if (presets) {
                dispatch(applyPresets(geoserverRestURL, importId, tasks, presets));
            }

        }).catch((e) => {
            dispatch(importTaskCreationError(e));
        });
    };
}

module.exports = {
    loadImports, createImport, uploadImportFiles,
    loadImport, runImport, deleteImport,
    updateTask, deleteTask, loadTask,
    loadTransform, updateTransform, deleteTransform,
    IMPORTS_LOADING,
    IMPORTS_LIST_LOADED,
    IMPORTS_LIST_LOAD_ERROR,
    IMPORT_CREATED,
    IMPORT_LOADED,
    IMPORT_RUN_SUCCESS,
    IMPORT_RUN_ERROR,
    IMPORT_DELETE,
    IMPORTS_TASK_CREATED,
    IMPORTS_TASK_CREATION_ERROR,
    IMPORTS_TASK_LOADED,
    IMPORTS_TASK_UPDATED,
    IMPORTS_TRANSFORM_LOAD,
    IMPORTS_TRANSFORM_UPDATED,
    IMPORTS_TRANSFORM_DELETE,
    IMPORTS_TRANSFORM_LOAD_ERROR,
    IMPORTS_TASK_DELETE,
    IMPORTS_FILE_UPLOADED,
    IMPORTS_UPLOAD_PROGRESS
};
