import { combineReducers } from 'redux';
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
import { DISCONNECT_SET } from '../constants/account';

const faucetDialog = (state = {
    open: false,
    success: false,
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FAUCET_DIALOG_SHOW:
        return {
            ...state,
            open: true,
            success: false,
        };
    case FAUCET_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    case FAUCET_BALANCE_ADD_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FAUCET_BALANCE_ADD_SUCCESS:
    case FAUCET_BALANCE_ADD_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case FAUCET_SUCCESS_SET:
        return {
            ...state,
            success: true,
        };
    default:
        return state;
    }
};

const balanceList = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_BALANCE_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_BALANCE_LIST_FETCH_SUCCESS: {
        const array = [...state.value, ...action.value];

        return {
            inProgress: false,
            value: array,
        };
    }
    case IBC_BALANCE_LIST_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            value: [],
        };
    default:
        return state;
    }
};

const faucetClaim = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case FAUCET_CLAIM_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FAUCET_CLAIM_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case FAUCET_CLAIM_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    faucetDialog,
    balanceList,
    faucetClaim,
});
