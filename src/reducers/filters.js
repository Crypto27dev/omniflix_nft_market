import { combineReducers } from 'redux';
import {
    CHAINS_SEARCH_SET,
    CHAINS_SET,
    COLLECTIONS_SEARCH_SET,
    COLLECTIONS_SET,
    FILTERS_HIDE,
    FILTERS_SHOW,
    GENRE_SEARCH_SET,
    GENRE_SET,
    ON_SALE_IN_SEARCH_SET,
    ON_SALE_IN_SET,
    PRICE_RANGE_COIN_SET,
    PRICE_RANGE_SET,
    STATUS_SET,
    TYPES_SEARCH_SET,
    TYPES_SET,
} from '../constants/filters';
import { chainsList, coinsList, collectionsList, genreList, onSaleList, statusList, typesList } from '../utils/filters';
import { ACTIVE_CARD_SET } from '../constants/explore';
import { tokensList } from '../utils/defaultOptions';

const show = (state = false, action) => {
    switch (action.type) {
    case FILTERS_SHOW:
        return true;
    case FILTERS_HIDE:
    case ACTIVE_CARD_SET:
        return false;
    default:
        return state;
    }
};

const status = (state = {
    list: statusList,
    value: new Set(),
}, action) => {
    switch (action.type) {
    case STATUS_SET:
        return {
            ...state,
            value: action.value,
        };
    default:
        return state;
    }
};

const priceRange = (state = {
    list: coinsList,
    value: tokensList && tokensList.length && tokensList[0],
    range: [0, 50000],
    min: 0,
    max: 50000,
}, action) => {
    switch (action.type) {
    case PRICE_RANGE_COIN_SET:
        return {
            ...state,
            value: action.value,
        };
    case PRICE_RANGE_SET:
        return {
            ...state,
            range: action.value,
        };
    default:
        return state;
    }
};

const genre = (state = {
    list: genreList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case GENRE_SET:
        return {
            ...state,
            value: action.value,
        };
    case GENRE_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const collections = (state = {
    list: collectionsList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case COLLECTIONS_SET:
        return {
            ...state,
            value: action.value,
        };
    case COLLECTIONS_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const chains = (state = {
    list: chainsList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case CHAINS_SET:
        return {
            ...state,
            value: action.value,
        };
    case CHAINS_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const onSaleIn = (state = {
    list: onSaleList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case ON_SALE_IN_SET:
        return {
            ...state,
            value: action.value,
        };
    case ON_SALE_IN_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

const types = (state = {
    list: typesList,
    value: new Set(),
    search: '',
}, action) => {
    switch (action.type) {
    case TYPES_SET:
        return {
            ...state,
            value: action.value,
        };
    case TYPES_SEARCH_SET:
        return {
            ...state,
            search: action.value,
        };
    default:
        return state;
    }
};

export default combineReducers({
    show,
    status,
    priceRange,
    genre,
    collections,
    chains,
    onSaleIn,
    types,
});
