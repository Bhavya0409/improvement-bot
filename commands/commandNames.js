import {CONFIG} from "../config.js";

const suffix = CONFIG.NODE_ENV === 'development' ? '-dev' : '';

export const ADD_TASK = `add${suffix}`
export const COMPLETE_TASK = `complete${suffix}`
export const LIST_ACTIVE_TASKS = `list${suffix}`
export const RANDOM = `random${suffix}`
export const EDIT_TASK = `edit${suffix}`
export const REFRESH = `refresh${suffix}`
export const ADD_TAG = `addtag${suffix}`
export const REMOVE_TAG = `removetag${suffix}`
