import { combineReducers } from 'redux';
import {
    AMOUNT_VALUE_SET,
    CLEAR_MY_ACCOUNT_DATA,
    DEPOSITE_DIALOG_HIDE,
    DEPOSITE_DIALOG_SHOW,
    FETCH_OWNER_COLLECTIONS_ERROR,
    FETCH_OWNER_COLLECTIONS_IN_PROGRESS,
    FETCH_OWNER_COLLECTIONS_SUCCESS,
    FETCH_OWNER_NFT_S_ERROR,
    FETCH_OWNER_NFT_S_IN_PROGRESS,
    FETCH_OWNER_NFT_S_SUCCESS,
    FETCH_USER_BALANCE_ERROR,
    FETCH_USER_BALANCE_IN_PROGRESS,
    FETCH_USER_BALANCE_SUCCESS,
    FETCH_USER_COLLECTIONS_ERROR,
    FETCH_USER_COLLECTIONS_IN_PROGRESS,
    FETCH_USER_COLLECTIONS_SUCCESS,
    FETCH_USER_NFT_S_ERROR,
    FETCH_USER_NFT_S_IN_PROGRESS,
    FETCH_USER_NFT_S_SUCCESS,
    NFT_TRANSFER_ERROR,
    NFT_TRANSFER_IN_PROGRESS,
    NFT_TRANSFER_SUCCESS,
    WITHDRAW_DIALOG_HIDE,
    WITHDRAW_DIALOG_SHOW,
} from '../constants/myAccount';
import { DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_TOTAL } from '../config';
import { PLACE_BID_DIALOG_HIDE } from '../constants/auctions';

const depositeDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case DEPOSITE_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case DEPOSITE_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

const withDrawDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case WITHDRAW_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case WITHDRAW_DIALOG_HIDE:
        return {
            ...state,
            open: false,
        };
    default:
        return state;
    }
};

const amountValue = (state = null, action) => {
    switch (action.type) {
    case AMOUNT_VALUE_SET:
        return action.value;
    case DEPOSITE_DIALOG_HIDE:
    case WITHDRAW_DIALOG_HIDE:
    case PLACE_BID_DIALOG_HIDE:
        return null;
    default:
        return state;
    }
};

const nftTransfer = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case NFT_TRANSFER_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case NFT_TRANSFER_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case NFT_TRANSFER_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const userCollections = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    count: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_USER_COLLECTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_USER_COLLECTIONS_SUCCESS:
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.result,
                count: action.count,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.result],
                count: action.count,
                skip: action.skip,
                limit: action.limit,
            };
        }
    case FETCH_USER_COLLECTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case CLEAR_MY_ACCOUNT_DATA:
        return {
            ...state,
            result: [],
            skip: DEFAULT_SKIP,
            limit: DEFAULT_LIMIT,
            count: DEFAULT_TOTAL,
        };
    default:
        return state;
    }
};

const userNFTs = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    count: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_USER_NFT_S_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_USER_NFT_S_SUCCESS:
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.result,
                count: action.count,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.result],
                count: action.count,
                skip: action.skip,
                limit: action.limit,
            };
        }
    case FETCH_USER_NFT_S_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case CLEAR_MY_ACCOUNT_DATA:
        return {
            ...state,
            result: [],
            skip: DEFAULT_SKIP,
            limit: DEFAULT_LIMIT,
            count: DEFAULT_TOTAL,
        };
    default:
        return state;
    }
};

const userBalance = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case FETCH_USER_BALANCE_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_USER_BALANCE_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case FETCH_USER_BALANCE_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const ownerCollections = (state = {
    inProgress: false,
    result: [],
    count: 0,
}, action) => {
    switch (action.type) {
    case FETCH_OWNER_COLLECTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_OWNER_COLLECTIONS_SUCCESS:
        return {
            inProgress: false,
            result: action.result,
            count: action.count,
        };
    case FETCH_OWNER_COLLECTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const ownerNFTs = (state = {
    inProgress: false,
    result: [],
    count: 0,
}, action) => {
    switch (action.type) {
    case FETCH_OWNER_NFT_S_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_OWNER_NFT_S_SUCCESS:
        return {
            inProgress: false,
            result: action.result,
            count: action.count,
        };
    case FETCH_OWNER_NFT_S_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    depositeDialog,
    withDrawDialog,
    amountValue,
    nftTransfer,

    userCollections,
    userNFTs,
    ownerCollections,
    ownerNFTs,
    userBalance,
});
