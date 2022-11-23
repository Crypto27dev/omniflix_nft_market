import {
    ALLOWANCES_FETCH_ERROR,
    ALLOWANCES_FETCH_IN_PROGRESS,
    ALLOWANCES_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_FETCH_SUCCESS,
} from '../../constants/wallet';
import Axios from 'axios';
import { urlFetchAllowances, urlFetchBalance } from '../../constants/restURL';

const fetchBalanceInProgress = () => {
    return {
        type: BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchBalanceSuccess = (value) => {
    return {
        type: BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchBalanceError = (message) => {
    return {
        type: BALANCE_FETCH_ERROR,
        message,
    };
};

export const fetchBalance = (address) => (dispatch) => {
    dispatch(fetchBalanceInProgress());

    const url = urlFetchBalance(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchBalanceSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchAllowancesInProgress = () => {
    return {
        type: ALLOWANCES_FETCH_IN_PROGRESS,
    };
};

const fetchAllowancesSuccess = (value) => {
    return {
        type: ALLOWANCES_FETCH_SUCCESS,
        value,
    };
};

const fetchAllowancesError = (message) => {
    return {
        type: ALLOWANCES_FETCH_ERROR,
        message,
    };
};

export const fetchAllowances = (address) => (dispatch) => {
    dispatch(fetchAllowancesInProgress());

    const url = urlFetchAllowances(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchAllowancesSuccess(res.data && res.data.allowances));
        })
        .catch((error) => {
            dispatch(fetchAllowancesError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
