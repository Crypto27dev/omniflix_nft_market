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

export const showFilters = () => {
    return {
        type: FILTERS_SHOW,
    };
};

export const hideFilters = () => {
    return {
        type: FILTERS_HIDE,
    };
};

export const setStatus = (value) => {
    return {
        type: STATUS_SET,
        value,
    };
};

export const setPriceRangeCoin = (value) => {
    return {
        type: PRICE_RANGE_COIN_SET,
        value,
    };
};

export const setPriceRange = (value) => {
    return {
        type: PRICE_RANGE_SET,
        value,
    };
};

export const setGenre = (value) => {
    return {
        type: GENRE_SET,
        value,
    };
};

export const setGenreSearch = (value) => {
    return {
        type: GENRE_SEARCH_SET,
        value,
    };
};

export const setCollections = (value) => {
    return {
        type: COLLECTIONS_SET,
        value,
    };
};

export const setCollectionsSearch = (value) => {
    return {
        type: COLLECTIONS_SEARCH_SET,
        value,
    };
};

export const setChains = (value) => {
    return {
        type: CHAINS_SET,
        value,
    };
};

export const setChainsSearch = (value) => {
    return {
        type: CHAINS_SEARCH_SET,
        value,
    };
};

export const setOnSaleIn = (value) => {
    return {
        type: ON_SALE_IN_SET,
        value,
    };
};

export const setOnSaleInSearch = (value) => {
    return {
        type: ON_SALE_IN_SEARCH_SET,
        value,
    };
};

export const setTypes = (value) => {
    return {
        type: TYPES_SET,
        value,
    };
};

export const setTypesSearch = (value) => {
    return {
        type: TYPES_SEARCH_SET,
        value,
    };
};
