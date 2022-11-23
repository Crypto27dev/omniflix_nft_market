import {
    FAUCET_BALANCE_ADD_ERROR,
    FAUCET_BALANCE_ADD_IN_PROGRESS,
    FAUCET_BALANCE_ADD_SUCCESS,
    FAUCET_CLAIM_FETCH_ERROR,
    FAUCET_CLAIM_FETCH_IN_PROGRESS,
    FAUCET_CLAIM_FETCH_SUCCESS,
    FAUCET_DIALOG_HIDE,
    FAUCET_DIALOG_SHOW,
    FAUCET_SUCCESS_SET,
    IBC_BALANCE_LIST_FETCH_ERROR,
    IBC_BALANCE_LIST_FETCH_IN_PROGRESS,
    IBC_BALANCE_LIST_FETCH_SUCCESS,
} from '../constants/faucet';
import Axios from 'axios';
import { urlAddFaucet, urlFetchIBCBalance } from '../constants/restURL';
import { urlFaucetValidation } from '../constants/url';

export const showFaucetDialog = (value) => {
    return {
        type: FAUCET_DIALOG_SHOW,
        value,
    };
};

export const hideFaucetDialog = () => {
    return {
        type: FAUCET_DIALOG_HIDE,
    };
};

export const setFaucetSuccess = () => {
    return {
        type: FAUCET_SUCCESS_SET,
    };
};

const addFaucetBalanceInProgress = () => {
    return {
        type: FAUCET_BALANCE_ADD_IN_PROGRESS,
    };
};

const addFaucetBalanceSuccess = () => {
    return {
        type: FAUCET_BALANCE_ADD_SUCCESS,
    };
};

const addFaucetBalanceError = (message) => {
    return {
        type: FAUCET_BALANCE_ADD_ERROR,
        message,
        variant: 'error',
    };
};

export const addFaucetBalance = (chain, data, cb) => (dispatch) => {
    dispatch(addFaucetBalanceInProgress());

    const url = urlAddFaucet(chain);
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(addFaucetBalanceSuccess());
            cb(null);
        })
        .catch((error) => {
            dispatch(addFaucetBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.error
                    ? error.response.data.error
                    : error.response &&
                    error.response.data &&
                    error.response.data.message
                        ? error.response.data.message
                        : 'Failed!',
            ));
            cb(error);
        });
};

const fetchIBCBalanceListInProgress = () => {
    return {
        type: IBC_BALANCE_LIST_FETCH_IN_PROGRESS,
    };
};

const fetchIBCBalanceListSuccess = (value) => {
    return {
        type: IBC_BALANCE_LIST_FETCH_SUCCESS,
        value,
    };
};

const fetchIBCBalanceListError = (message) => {
    return {
        type: IBC_BALANCE_LIST_FETCH_ERROR,
        message,
    };
};

export const fetchIBCBalanceList = (ibcUrl, address) => (dispatch) => {
    dispatch(fetchIBCBalanceListInProgress());

    const url = urlFetchIBCBalance(ibcUrl, address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchIBCBalanceListSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchIBCBalanceListError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchFaucetClaimInProgress = () => {
    return {
        type: FAUCET_CLAIM_FETCH_IN_PROGRESS,
    };
};

const fetchFaucetClaimSuccess = (value) => {
    return {
        type: FAUCET_CLAIM_FETCH_SUCCESS,
        value,
    };
};

const fetchFaucetClaimError = (message) => {
    return {
        type: FAUCET_CLAIM_FETCH_ERROR,
        message,
    };
};

export const fetchFaucetClaim = (address) => (dispatch) => {
    dispatch(fetchFaucetClaimInProgress());

    const url = urlFaucetValidation(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchFaucetClaimSuccess(res.data));
        })
        .catch((error) => {
            dispatch(fetchFaucetClaimError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
