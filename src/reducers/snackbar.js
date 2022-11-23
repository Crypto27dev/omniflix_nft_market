import { MESSAGE_SHOW, SNACKBAR_HIDE } from '../constants/snackbar';
import {
    CONNECT_KEPLR_ACCOUNT_ERROR,
    TX_HASH_FETCH_SUCCESS,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
    TX_SIGN_ERROR,
    WALLET_CONNECT_ERROR,
} from '../constants/wallet';
import { CONNECT_BC_ACCOUNT_ERROR, VERIFY_ACCOUNT_ERROR, VERIFY_ACCOUNT_SUCCESS } from '../constants/account';
import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    IBC_BALANCE_FETCH_ERROR,
    IBC_TX_IN_PROGRESS_SET,
    TIMEOUT_HEIGHT_FETCH_ERROR,
} from '../constants/IBCTokens';
import { FAUCET_BALANCE_ADD_ERROR } from '../constants/faucet';
import { FEE_GRANT_ALLOWANCE_ERROR, FEE_GRANT_ALLOWANCE_SUCCESS } from '../constants/campaign';

const snackbar = (state = {
    open: false,
    message: '',
    explorer: null,
}, action) => {
    switch (action.type) {
    case FEE_GRANT_ALLOWANCE_SUCCESS:
    case FEE_GRANT_ALLOWANCE_ERROR:
    case CONNECT_BC_ACCOUNT_ERROR:// BC Account
    case CONNECT_KEPLR_ACCOUNT_ERROR:
    case WALLET_CONNECT_ERROR:
    case VERIFY_ACCOUNT_ERROR:
    case VERIFY_ACCOUNT_SUCCESS:
    case TX_SIGN_ERROR:
    case TX_SIGN_AND_BROAD_CAST_ERROR:
    case TX_SIGN_AND_BROAD_CAST_SUCCESS:
    case TX_HASH_FETCH_SUCCESS:
    case FAUCET_BALANCE_ADD_ERROR:
    case CONNECT_IBC_ACCOUNT_ERROR:// IBC Account
    case IBC_BALANCE_FETCH_ERROR:
    case AMINO_SIGN_IBC_TX_SUCCESS:
    case AMINO_SIGN_IBC_TX_ERROR:
    case TIMEOUT_HEIGHT_FETCH_ERROR:
    case MESSAGE_SHOW:
        return {
            open: true,
            message: action.message,
            variant: action.variant,
            hash: action.hash,
            explorer: action.explorer ? action.explorer : null,
        };
    case SNACKBAR_HIDE:
        return {
            open: false,
            message: '',
            variant: '',
            hash: '',
            explorer: null,
        };
    case IBC_TX_IN_PROGRESS_SET:
        if (action.type === false) {
            return {
                open: false,
                message: '',
            };
        }
        return state;
    default:
        return state;
    }
};

export default snackbar;
