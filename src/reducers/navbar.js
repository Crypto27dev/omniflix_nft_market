import { combineReducers } from 'redux';
import {
    CONNECT_DIALOG_HIDE,
    CONNECT_DIALOG_SHOW,
    HIDE_SIDE_BAR_SET,
    SEARCH_VALUE_SET,
    SHOW_SIDE_BAR_SET,
} from '../constants/navbar';

const searchValue = (state = '', action) => {
    if (action.type === SEARCH_VALUE_SET) {
        return action.value;
    }

    return state;
};

const show = (state = false, action) => {
    switch (action.type) {
    case SHOW_SIDE_BAR_SET:
        return true;
    case HIDE_SIDE_BAR_SET:
        return false;
    default:
        return state;
    }
};

const connectDialog = (state = false, action) => {
    switch (action.type) {
    case CONNECT_DIALOG_SHOW:
        return true;
    case CONNECT_DIALOG_HIDE:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    searchValue,
    show,
    connectDialog,
});
