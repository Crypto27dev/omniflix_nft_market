import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_IN_PROGRESS,
    AMINO_SIGN_IBC_TX_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    CONNECT_IBC_ACCOUNT_SUCCESS,
    IBC_BALANCE_FETCH_ERROR,
    IBC_BALANCE_FETCH_IN_PROGRESS,
    IBC_BALANCE_FETCH_SUCCESS,
    IBC_TX_IN_PROGRESS_SET,
    TIMEOUT_HEIGHT_FETCH_ERROR,
    TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    TIMEOUT_HEIGHT_FETCH_SUCCESS,
} from '../../constants/IBCTokens';
import { combineReducers } from 'redux';
import { DEPOSITE_DIALOG_HIDE } from '../../constants/myAccount';

const connection = (state = {
    inProgress: false,
    address: '',
    signInProgress: false,
}, action) => {
    switch (action.type) {
    case CONNECT_IBC_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case CONNECT_IBC_ACCOUNT_SUCCESS:
        return {
            ...state,
            inProgress: false,
            address: action.value && action.value.length &&
            action.value[0] && action.value[0].bech32Address
                ? action.value[0].bech32Address
                : action.value && action.value.length &&
                action.value[0] && action.value[0].address,
        };
    case CONNECT_IBC_ACCOUNT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case AMINO_SIGN_IBC_TX_IN_PROGRESS:
        return {
            ...state,
            signInProgress: true,
        };
    case AMINO_SIGN_IBC_TX_SUCCESS:
    case AMINO_SIGN_IBC_TX_ERROR:
        return {
            ...state,
            signInProgress: false,
        };
    case DEPOSITE_DIALOG_HIDE:
        return {
            ...state,
            address: '',
        };
    default:
        return state;
    }
};

const balance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_BALANCE_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_BALANCE_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case IBC_BALANCE_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DEPOSITE_DIALOG_HIDE:
        return {
            ...state,
            value: [],
        };
    default:
        return state;
    }
};

const timeoutHeight = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TIMEOUT_HEIGHT_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TIMEOUT_HEIGHT_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TIMEOUT_HEIGHT_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const ibcTxInProgress = (state = false, action) => {
    if (action.type === IBC_TX_IN_PROGRESS_SET) {
        return action.value;
    }

    return state;
};

export default combineReducers({
    connection,
    balance,
    timeoutHeight,
    ibcTxInProgress,
});
