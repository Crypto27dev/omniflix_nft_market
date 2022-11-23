import {
    CONNECT_DIALOG_HIDE,
    CONNECT_DIALOG_SHOW,
    HIDE_SIDE_BAR_SET,
    SEARCH_VALUE_SET,
    SHOW_SIDE_BAR_SET,
} from '../constants/navbar';

export const searchFieldSet = (value) => {
    return {
        type: SEARCH_VALUE_SET,
        value,
    };
};

export const showSideBar = () => {
    return {
        type: SHOW_SIDE_BAR_SET,
    };
};

export const hideSideBar = () => {
    return {
        type: HIDE_SIDE_BAR_SET,
    };
};

export const showConnectDialog = () => {
    return {
        type: CONNECT_DIALOG_SHOW,
    };
};

export const hideConnectDialog = () => {
    return {
        type: CONNECT_DIALOG_HIDE,
    };
};
