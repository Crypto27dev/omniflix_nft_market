import { combineReducers } from 'redux';
import {
    ALLOWANCES_FETCH_ERROR,
    ALLOWANCES_FETCH_IN_PROGRESS,
    ALLOWANCES_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_FETCH_SUCCESS,
    TX_HASH_FETCH_IN_PROGRESS,
    TX_HASH_FETCH_SUCCESS,
    TX_HASH_IN_PROGRESS_FALSE_SET,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
    TX_SIGN_ERROR,
    TX_SIGN_IN_PROGRESS,
    TX_SIGN_IN_PROGRESS_SET,
    TX_SIGN_SUCCESS,
} from '../../constants/wallet';

const balance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case BALANCE_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const txHash = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_HASH_FETCH_IN_PROGRESS:
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_HASH_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_HASH_IN_PROGRESS_FALSE_SET:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const signTx = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_SIGN_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_SIGN_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_SIGN_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case TX_SIGN_IN_PROGRESS_SET:
        return {
            ...state,
            inProgress: action.value,
        };
    default:
        return state;
    }
};

const allowances = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case ALLOWANCES_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case ALLOWANCES_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case ALLOWANCES_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    balance,
    txHash,
    signTx,
    allowances,
});
