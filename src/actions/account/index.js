import {
    CHAIN_ID_SET,
    CONFIRM_DEPOSIT_SET,
    CONFIRM_WITHDRAW_SET,
    CONNECT_BC_ACCOUNT_ERROR,
    CONNECT_BC_ACCOUNT_IN_PROGRESS,
    CONNECT_BC_ACCOUNT_SUCCESS,
    DISCONNECT_SET,
    VERIFY_ACCOUNT_ERROR,
    VERIFY_ACCOUNT_IN_PROGRESS,
    VERIFY_ACCOUNT_SUCCESS,
} from '../../constants/account';
import Axios from 'axios';
import { CONNECT_ACCOUNT_URL, urlVerifyAccount } from '../../constants/url';

const connectBCAccountInProgress = () => {
    return {
        type: CONNECT_BC_ACCOUNT_IN_PROGRESS,
    };
};

const connectBCAccountSuccess = (value) => {
    return {
        type: CONNECT_BC_ACCOUNT_SUCCESS,
        value,
    };
};

const connectBCAccountError = (message) => {
    return {
        type: CONNECT_BC_ACCOUNT_ERROR,
        message,
        variant: 'error',
    };
};

export const connectBCAccount = (data, cb) => (dispatch) => {
    dispatch(connectBCAccountInProgress());

    Axios.post(CONNECT_ACCOUNT_URL, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(connectBCAccountSuccess(res.data.result));
            cb(res.data.result);
        })
        .catch((error) => {
            dispatch(connectBCAccountError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const verifyAccountInProgress = () => {
    return {
        type: VERIFY_ACCOUNT_IN_PROGRESS,
    };
};

const verifyAccountSuccess = (message, value) => {
    return {
        type: VERIFY_ACCOUNT_SUCCESS,
        message,
        value,
        variant: 'success',
    };
};

const verifyAccountError = (message) => {
    return {
        type: VERIFY_ACCOUNT_ERROR,
        message,
        variant: 'error',
    };
};

export const verifyAccount = (userId, data, cb) => (dispatch) => {
    dispatch(verifyAccountInProgress());

    const url = urlVerifyAccount(userId);
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(verifyAccountSuccess('Success', res.data && res.data.result['access_token']));
            localStorage.setItem('acToken_of_nucleus', res.data && res.data.result['access_token']);
            localStorage.setItem('rfToken_of_nucleus', res.data && res.data.result['refresh_token']);
            cb(null);
        })
        .catch((error) => {
            dispatch(verifyAccountError(
                error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.message
                    ? error.response.data.message.message
                    : error.response.data.message
                        ? error.response.data.message
                        : 'Failed!',
            ));
            cb(error);
        });
};

export const setDisconnect = () => {
    return {
        type: DISCONNECT_SET,
    };
};

export const setChainID = (value) => {
    return {
        type: CHAIN_ID_SET,
        value,
    };
};

export const setDepositConfirm = (value) => {
    return {
        type: CONFIRM_DEPOSIT_SET,
        value,
    };
};

export const setWithdrawConfirm = (value) => {
    return {
        type: CONFIRM_WITHDRAW_SET,
        value,
    };
};
