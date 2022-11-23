import { combineReducers } from 'redux';
import BCDetails from './BCDetails';
import wallet from './wallet';
import { CHAIN_ID_SET, CONFIRM_DEPOSIT_SET, CONFIRM_WITHDRAW_SET } from '../../constants/account';
import { tokensList } from '../../utils/defaultOptions';
import {
    IBC_TOKENS_LIST_FETCH_ERROR,
    IBC_TOKENS_LIST_FETCH_IN_PROGRESS,
    IBC_TOKENS_LIST_FETCH_SUCCESS,
} from '../../constants/marketplace';
import IBCTokens from './IBCTokens';
import { DEPOSITE_DIALOG_HIDE, WITHDRAW_DIALOG_HIDE } from '../../constants/myAccount';

const chainID = (state = {
    inProgress: false,
    value: tokensList[0],
    list: [],
}, action) => {
    switch (action.type) {
    case CHAIN_ID_SET:
        return {
            ...state,
            value: action.value,
        };
    case IBC_TOKENS_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_TOKENS_LIST_FETCH_SUCCESS: {
        const array = [...action.value];
        return {
            ...state,
            inProgress: false,
            list: [...array],
        };
    }
    case IBC_TOKENS_LIST_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const confirmDeposit = (state = false, action) => {
    switch (action.type) {
    case CONFIRM_DEPOSIT_SET:
        return action.value;
    case DEPOSITE_DIALOG_HIDE:
        return false;

    default:
        return state;
    }
};

const confirmWithdraw = (state = false, action) => {
    switch (action.type) {
    case CONFIRM_WITHDRAW_SET:
        return action.value;
    case WITHDRAW_DIALOG_HIDE:
        return false;

    default:
        return state;
    }
};

export default combineReducers({
    chainID,
    wallet,
    bc: BCDetails,
    ibc: IBCTokens,
    confirmDeposit,
    confirmWithdraw,
});
