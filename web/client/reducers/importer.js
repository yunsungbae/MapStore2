/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
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
    IMPORTS_TASK_DELETE,
    IMPORTS_TRANSFORM_LOAD,
    IMPORTS_TRANSFORM_DELETE,
    IMPORTS_FILE_UPLOADED,
    IMPORTS_UPLOAD_PROGRESS
} = require('../actions/importer');
const assign = require('object-assign');

/******************************************************************************/
/* UTILITY FUNCTIONS **********************************************************/
/******************************************************************************/

function updateArray(tasks, newTask) {
    if (!newTask || !tasks) {
        return tasks;
    }
    let taskIndex = tasks.findIndex( (task) => task.id === newTask.id );
    if (taskIndex >= 0 && newTask !== tasks[taskIndex]) {
        let newTasks = tasks.slice();
        newTasks[taskIndex] = newTask;
        return newTasks;
    }
    return tasks;
}
function updateImportLoadingStatus(state, action, loading = true) {
    let importId = action.importId !== undefined ? action.importId : (action.details && action.details.importId);
    let selectedImport = state && state.selectedImport;
    // TODO state.tasks update this if needed
    // update selected import
    let imports = state && state.imports;
    if (selectedImport && selectedImport.id === importId) {
        selectedImport = assign({}, selectedImport, {loading: loading});
    }
    // update imports list
    imports = updateArray(imports, assign({}, imports.find((imp) => imp.id === importId), {loading: loading}));
    return assign({}, state, {
        uploading: action.details && action.details.uploadingFiles !== undefined || state.uploading,
        loading: loading,
        selectedImport,
        imports
    });
}
function updateImportTaskLoadingStatus(state, action, loading = true) {
    let selectedImport = state && state.selectedImport;
    let selectedTask = state && state.selectedTask;
    // TODO state.tasks update this if needed
    let imports = state && state.imports;
    let importId = action.importId !== undefined ? action.importId : (action.details && action.details.importId);
    let taskId = action.taskId !== undefined ? action.taskId : (action.details && action.details.taskId);
    // update selected import
    if (selectedImport && importId === selectedImport.id) {
        if ( selectedTask && selectedTask.id === taskId ) {
            selectedTask = assign({}, selectedTask, {
                loading: loading,
                message: action.details && action.details.message,
                element: action.details && action.details.element
            });
        }
        let newTask = assign({}, selectedImport.tasks.find((task) => task.id === taskId), {
            loading: loading,
            message: action.details && action.details.message,
            element: action.details && action.details.element
        });
        // update selected task
        if (selectedImport && selectedImport.tasks && newTask && newTask.id) {
            selectedImport = assign({}, selectedImport);
            selectedImport.tasks = updateArray(selectedImport.tasks, newTask);
        }
    }
    // update imports list's task
    let impIndex = imports && imports.findIndex((imp) => imp.id === importId);
    if ( imports && impIndex >= 0 ) {
        imports = imports.concat();
        let imp = imports[impIndex];
        let taskIndex = imp && imp.tasks && imp.tasks.findIndex((task) => task.id === taskId);
        if ( imp && imp.tasks && taskIndex >= 0 ) {
            let task = assign({}, task, {
                loading: loading,
                message: action.details && action.details.message,
                element: action.details && action.details.element
            });
            imports[impIndex] = assign({}, imp);
            imports[impIndex].tasks = updateArray(imports[impIndex].tasks, task);
        }
    }
    return assign({}, state, {
        uploading: action.details && action.details.uploadingFiles !== undefined || state.uploading,
        loading: loading,
        selectedTask,
        selectedImport,
        imports
    });
}

/******************************************************************************/
/* REDUCER ********************************************************************/
/******************************************************************************/

function importer(state = {}, action) {
    switch (action.type) {
        case IMPORTS_LOADING: {
            if (!action.details) {
                // loading full list
                return assign({}, state, {loading: true, uploading: action.details && action.details.uploadingFiles !== undefined || state.uploading});
            } else if (action.details.importId !== undefined && action.details.taskId === undefined) {
                // loading an import
                return updateImportLoadingStatus(state, action);
            } else if (action.details.importId !== undefined && action.details.taskId !== undefined) {
                // loading a task
                return updateImportTaskLoadingStatus(state, action);
            }
        }
        case IMPORTS_LIST_LOADED:
            return assign({}, state, {
                loading: false,
                imports: action.imports,
                selectedImport: null,
                selectedTask: null,
                selectedTransform: null
            });
        case IMPORTS_LIST_LOAD_ERROR:
            return {
                loading: false,
                loadingError: action.error
            };
        case IMPORT_CREATED:
            return assign({}, state, {
                loading: false,
                selectedImport: action.import,
                selectedTask: null,
                selectedTransform: null
            });
        case IMPORTS_TASK_CREATED:
            if (action.task || action.tasks && action.tasks.length === 1) {
                return assign({}, state, {
                    loading: false,
                    selectedTask: action.task || action.tasks[0] || null
                });
            }
            return assign({}, state, {
                loading: false,
                tasks: action.tasks
            });

        case IMPORTS_TASK_UPDATED:
            let selectedTask = state && state.selectedTask;
            if ( action.task && selectedTask && selectedTask.id === action.task.id) {
                selectedTask = action.task;
            }
            let tasks = state.tasks;
            if (tasks && action.task) {
                let index = tasks.findIndex((task) => task.id === action.task.id);
                if (index >= 0) {
                    tasks = tasks.concat();
                    tasks[index] = action.task;
                }
            }
            return assign({}, state, {
                loading: false,
                selectedTask,
                tasks
            });
        case IMPORTS_TASK_CREATION_ERROR: {
            return assign({}, state, {
                loading: false,
                uploading: false,
                error: action.error
            });
        }
        case IMPORTS_TRANSFORM_LOAD: {
            let transform = assign({}, action.transform);
            transform.id = action.transformId;
            return assign({}, updateImportTaskLoadingStatus(state, action, false), {
                loading: false,
                selectedTransform: action.transform
            });
        }
        case IMPORTS_TRANSFORM_DELETE: {
            if (state.selectedTask &&
                state.selectedTask.transformChain &&
                state.selectedTask.transformChain.transforms &&
                state.selectedTask.transformChain.transforms[action.transformId]
                ) {
                let newSelectedTask = assign({}, state.selectedTask, {
                    transformsChain: assign({}, state.selectedTask.transformChain, {
                        transforms: state.selectedTask.transformChain.transforms.filter((obj, index) => index !== action.transformId)
                    })
                });
                return assign({}, state, {
                    selectedTask: newSelectedTask,
                    selectedTransform: state.selectedTransform && state.selectedTransform.id === action.transformId ? null : state.selectedTransform
                });
            }
        }
        case IMPORT_LOADED: {
            return assign({}, state, {
                loading: false,
                selectedImport: action.import,
                selectedTask: null,
                selectedTransform: null
            });
        }
        case IMPORT_RUN_SUCCESS: {
            return updateImportLoadingStatus(state, action, false);
        }
        case IMPORT_RUN_ERROR: {
            return updateImportLoadingStatus(state, action, false);

        }
        case IMPORTS_TASK_LOADED: {
            return assign({}, state, {
                loading: false,
                selectedTask: action.task,
                selectedTransform: null
            });
        }
        case IMPORTS_TASK_DELETE: {
            let seletedTask = state.selectedTask;
            let selectedImport = state.selectedImport;
            if (selectedTask && selectedTask.id === action.taskId && selectedImport && selectedImport.id === action.importId) {
                seletedTask = null;
            }
            if (selectedImport && selectedImport.id === action.importId) {
                selectedImport = assign({}, selectedImport);
                selectedImport.tasks = selectedImport.tasks.filter((task) => task.id !== action.taskId);
            }
            return assign({}, state, {
                loading: false,
                seletedTask,
                selectedImport
            });
        }
        case IMPORT_DELETE: {
            let imports = state && state.imports;
            let importIndex = imports && imports.findIndex((imp) => imp.id === action.id);
            if (importIndex >= 0) {
                imports = state.imports.filter((imp) => imp.id !== action.id);
            }
            if (state && state.selectedImport && state.selectedImport.id === action.id) {
                return assign({}, state, {
                    imports,
                    loading: false,
                    selectedImport: null,
                    selectedTask: null,
                    selectedTransform: null
                });
            }
            return assign({}, state, {
                loading: false,
                imports
            });
        }
        case IMPORTS_FILE_UPLOADED: {
            return assign({}, state, {
                loading: false,
                uploading: false
            });
        }
        case IMPORTS_UPLOAD_PROGRESS: {
            return assign({}, state, {
                uploading: {
                    progress: action.progress
                }
            });
        }
        default:
            return state;
    }
}

module.exports = importer;
