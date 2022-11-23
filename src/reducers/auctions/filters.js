import { combineReducers } from 'redux';
import { ACTIVE_CARD_SET } from '../../constants/explore';
import { coinsList, onSaleList } from '../../utils/filters';
import { tokensList } from '../../utils/defaultOptions';
import {
    CA_AUCTION_TYPE_SET,
    CA_ON_SALE_IN_SEARCH_SET,
    CA_ON_SALE_IN_SET,
    CA_PRICE_RANGE_COIN_SET,
    CA_PRICE_RANGE_SET,
    COLLECTION_AUCTION_FILTERS_HIDE,
    COLLECTION_AUCTION_FILTERS_SHOW,
    LA_AUCTION_TYPE_SET,
    LA_ON_SALE_IN_SEARCH_SET,
    LA_ON_SALE_IN_SET,
    LA_PRICE_RANGE_COIN_SET,
    LA_PRICE_RANGE_SET,
    LISTING_AUCTION_FILTERS_HIDE,
    LISTING_AUCTION_FILTERS_SHOW,
    PLACE_BID_DIALOG_HIDE,
} from '../../constants/auctions';
import { DELIST_DIALOG_HIDE, SELL_DIALOG_HIDE } from '../../constants/marketplace';

const showCA = (state = false, action) => {
    switch (action.type) {
    case COLLECTION_AUCTION_FILTERS_SHOW:
        return true;
    case COLLECTION_AUCTION_FILTERS_HIDE:
    case ACTIVE_CARD_SET:
        return false;
    default:
        return state;
    }
};

const priceRangeCA = (state = {
    list: coinsList,
    value: tokensList && tokensList.length && tokensList[0],
    range: [0, 50000],
    min: 0,
    max: 50000,
}, action) => {
    switch (action.type) {
    case CA_PRICE_RANGE_COIN_SET:
        return {
            ...state,
            value: action.value,
        };
    case CA_PRICE_RANGE_SET:
        return {
            ...state,
            range: action.value,
        };
    default:
        return state;
    }
};

const onSaleInCA = (state = {
    list: onSaleList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case CA_ON_SALE_IN_SET:
        return {
            ...state,
            value: action.value,
        };
    case CA_ON_SALE_IN_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const auctionsTypeCA = (state = '', action) => {
    switch (action.type) {
    case CA_AUCTION_TYPE_SET:
        return action.value;
    case PLACE_BID_DIALOG_HIDE:
    case DELIST_DIALOG_HIDE:
    case SELL_DIALOG_HIDE:
        return '';
    default:
        return state;
    }
};

// Listing Auctions Filter
const showLA = (state = false, action) => {
    switch (action.type) {
    case LISTING_AUCTION_FILTERS_SHOW:
        return true;
    case LISTING_AUCTION_FILTERS_HIDE:
    case ACTIVE_CARD_SET:
        return false;
    default:
        return state;
    }
};

const priceRangeLA = (state = {
    list: coinsList,
    value: tokensList && tokensList.length && tokensList[0],
    range: [0, 50000],
    min: 0,
    max: 50000,
}, action) => {
    switch (action.type) {
    case LA_PRICE_RANGE_COIN_SET:
        return {
            ...state,
            value: action.value,
        };
    case LA_PRICE_RANGE_SET:
        return {
            ...state,
            range: action.value,
        };
    default:
        return state;
    }
};

const onSaleInLA = (state = {
    list: onSaleList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case LA_ON_SALE_IN_SET:
        return {
            ...state,
            value: action.value,
        };
    case LA_ON_SALE_IN_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const auctionsTypeLA = (state = '', action) => {
    switch (action.type) {
    case LA_AUCTION_TYPE_SET:
        return action.value;
    case PLACE_BID_DIALOG_HIDE:
    case DELIST_DIALOG_HIDE:
    case SELL_DIALOG_HIDE:
        return '';
    default:
        return state;
    }
};

export default combineReducers({
    showCA,
    priceRangeCA,
    onSaleInCA,
    auctionsTypeCA,

    showLA,
    priceRangeLA,
    onSaleInLA,
    auctionsTypeLA,
});
