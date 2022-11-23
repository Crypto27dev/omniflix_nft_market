import { combineReducers } from 'redux';
import {
    CONNECT_KEPLR_ACCOUNT_ERROR,
    CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    CONNECT_KEPLR_ACCOUNT_SUCCESS,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
    WALLET_CONNECT_ERROR,
    WALLET_CONNECT_IN_PROGRESS,
    WALLET_CONNECT_SUCCESS,
} from '../../constants/wallet';
import {
    CONNECT_BC_ACCOUNT_ERROR,
    CONNECT_BC_ACCOUNT_IN_PROGRESS,
    CONNECT_BC_ACCOUNT_SUCCESS,
    DISCONNECT_SET,
    KEPLR_ACCOUNT_KEYS_SET,
    VERIFY_ACCOUNT_ERROR,
    VERIFY_ACCOUNT_IN_PROGRESS,
    VERIFY_ACCOUNT_SUCCESS,
} from '../../constants/account';

const connection = (state = {
    inProgress: false,
    address: '',
    addressInProgress: false,
    keys: {},
    walletConnector: null,
}, action) => {
    switch (action.type) {
    case CONNECT_KEPLR_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
            addressInProgress: true,
        };
    case CONNECT_BC_ACCOUNT_IN_PROGRESS:
    case VERIFY_ACCOUNT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case CONNECT_KEPLR_ACCOUNT_SUCCESS:
        return {
            ...state,
            addressInProgress: false,
            inProgress: false,
            address: action.value && action.value.length &&
            action.value[0] && action.value[0].address ? action.value[0].address : '',
        };
    case CONNECT_KEPLR_ACCOUNT_ERROR:
        return {
            ...state,
            inProgress: false,
            addressInProgress: false,
        };
    case CONNECT_BC_ACCOUNT_SUCCESS:
    case CONNECT_BC_ACCOUNT_ERROR:
    case VERIFY_ACCOUNT_ERROR:
    case VERIFY_ACCOUNT_SUCCESS:
        return {
            ...state,
            inProgress: false,
        };
    case DISCONNECT_SET:
        return {
            ...state,
            address: '',
        };
    case KEPLR_ACCOUNT_KEYS_SET:
        return {
            ...state,
            keys: action.value,
        };
    case WALLET_CONNECT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
            addressInProgress: true,
        };
    case WALLET_CONNECT_SUCCESS:
        return {
            ...state,
            inProgress: false,
            addressInProgress: false,
            walletConnector: action.value,
            address: action.account && action.account.length && action.account[0] && action.account[0].bech32Address
                ? action.account[0].bech32Address : '',
            keys: action.account && action.account.length && action.account[0] ? action.account[0] : {},
        };
    case WALLET_CONNECT_ERROR:
        return {
            ...state,
            inProgress: false,
            addressInProgress: false,
        };
    default:
        return state;
    }
};

const broadCast = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TX_SIGN_AND_BROAD_CAST_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case TX_SIGN_AND_BROAD_CAST_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    broadCast,
    connection,
});
