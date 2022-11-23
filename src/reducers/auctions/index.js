import { combineReducers } from 'redux';
import {
    AUCTIONS_SEARCH_SET,
    AUCTIONS_SORT_SET,
    FETCH_AUCTION_LISTINGS_ERROR,
    FETCH_AUCTION_LISTINGS_IN_PROGRESS,
    FETCH_AUCTION_LISTINGS_SUCCESS,
    PLACE_BID_DIALOG_HIDE,
    PLACE_BID_DIALOG_SHOW,
    PLACE_BID_FAIL_SET,
    PLACE_BID_SUCCESS_SET,
} from '../../constants/auctions';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import filters from './filters';

const placeBidDialog = (state = {
    open: false,
    value: {},
    hash: '',
    success: false,
    fail: false,
}, action) => {
    switch (action.type) {
    case PLACE_BID_DIALOG_SHOW:
        return {
            ...state,
            open: true,
            value: action.value,
            success: false,
            fail: false,
        };
    case PLACE_BID_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            success: false,
            fail: false,
        };
    case PLACE_BID_SUCCESS_SET:
        return {
            ...state,
            success: true,
            hash: action.hash,
        };
    case PLACE_BID_FAIL_SET:
        return {
            ...state,
            fail: true,
        };
    default:
        return state;
    }
};

const auctionListings = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: null,
}, action) => {
    switch (action.type) {
    case FETCH_AUCTION_LISTINGS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_AUCTION_LISTINGS_SUCCESS: {
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.value,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
                total: action.total,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.value],
                skip: action.skip,
                limit: action.limit,
                total: action.total,
            };
        }
    }
    case FETCH_AUCTION_LISTINGS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const search = (state = {
    value: '',
}, action) => {
    if (action.type === AUCTIONS_SEARCH_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const sort = (state = {
    sortBy: 'created_at',
    order: '',
}, action) => {
    if (action.type === AUCTIONS_SORT_SET) {
        return {
            ...state,
            sortBy: action.sortBy,
            order: action.order,
        };
    }

    return state;
};

export default combineReducers({
    placeBidDialog,
    auctionListings,
    search,
    sort,
    filters,
});
