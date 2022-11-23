import { combineReducers } from 'redux';
import { ACTIVE_CARD_SET } from '../../constants/explore';
import { coinsList, onSaleList } from '../../utils/filters';
import { tokensList } from '../../utils/defaultOptions';
import {
    COLLECTION_FILTERS_HIDE,
    COLLECTION_FILTERS_SHOW,
    COLLECTION_ON_SALE_IN_SEARCH_SET,
    COLLECTION_ON_SALE_IN_SET,
    COLLECTION_PRICE_RANGE_COIN_SET,
    COLLECTION_PRICE_RANGE_SET,
} from '../../constants/collections';

const showCollectionFilter = (state = false, action) => {
    switch (action.type) {
    case COLLECTION_FILTERS_SHOW:
        return true;
    case COLLECTION_FILTERS_HIDE:
    case ACTIVE_CARD_SET:
        return false;
    default:
        return state;
    }
};

const priceRangeCollection = (state = {
    list: coinsList,
    value: tokensList && tokensList.length && tokensList[0],
    range: [0, 50000],
    min: 0,
    max: 50000,
}, action) => {
    switch (action.type) {
    case COLLECTION_PRICE_RANGE_COIN_SET:
        return {
            ...state,
            value: action.value,
        };
    case COLLECTION_PRICE_RANGE_SET:
        return {
            ...state,
            range: action.value,
        };
    default:
        return state;
    }
};

const onSaleInCollection = (state = {
    list: onSaleList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case COLLECTION_ON_SALE_IN_SET:
        return {
            ...state,
            value: action.value,
        };
    case COLLECTION_ON_SALE_IN_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

export default combineReducers({
    showCollectionFilter,
    priceRangeCollection,
    onSaleInCollection,
});
