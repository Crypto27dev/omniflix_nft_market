import {
    COLLECTION_FILTERS_HIDE,
    COLLECTION_FILTERS_SHOW,
    COLLECTION_ON_SALE_IN_SEARCH_SET,
    COLLECTION_ON_SALE_IN_SET,
    COLLECTION_PRICE_RANGE_COIN_SET,
    COLLECTION_PRICE_RANGE_SET,
} from '../../constants/collections';

export const showCollectionFilters = () => {
    return {
        type: COLLECTION_FILTERS_SHOW,
    };
};

export const hideCollectionFilters = () => {
    return {
        type: COLLECTION_FILTERS_HIDE,
    };
};

export const setCollectionPriceRangeCoin = (value) => {
    return {
        type: COLLECTION_PRICE_RANGE_COIN_SET,
        value,
    };
};

export const setCollectionPriceRange = (value) => {
    return {
        type: COLLECTION_PRICE_RANGE_SET,
        value,
    };
};

export const setCollectionOnSaleIn = (value) => {
    return {
        type: COLLECTION_ON_SALE_IN_SET,
        value,
    };
};

export const setCollectionOnSaleInSearch = (value) => {
    return {
        type: COLLECTION_ON_SALE_IN_SEARCH_SET,
        value,
    };
};
