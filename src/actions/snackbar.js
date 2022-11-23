import { MESSAGE_SHOW, SNACKBAR_HIDE } from '../constants/snackbar';

export const hideSnackbar = () => {
    return {
        type: SNACKBAR_HIDE,
    };
};

export const showMessage = (message, variant, hash, explorer) => {
    return {
        type: MESSAGE_SHOW,
        message,
        variant,
        hash,
        explorer,
    };
};
