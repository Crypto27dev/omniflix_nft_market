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
} from '../../constants/auctions';

export const showCollectionAuctionFilters = () => {
    return {
        type: COLLECTION_AUCTION_FILTERS_SHOW,
    };
};

export const hideCollectionAuctionFilters = () => {
    return {
        type: COLLECTION_AUCTION_FILTERS_HIDE,
    };
};

export const setCAPriceRangeCoin = (value) => {
    return {
        type: CA_PRICE_RANGE_COIN_SET,
        value,
    };
};

export const setCAPriceRange = (value) => {
    return {
        type: CA_PRICE_RANGE_SET,
        value,
    };
};

export const setCAOnSaleIn = (value) => {
    return {
        type: CA_ON_SALE_IN_SET,
        value,
    };
};

export const setCAOnSaleInSearch = (value) => {
    return {
        type: CA_ON_SALE_IN_SEARCH_SET,
        value,
    };
};

export const setCAAuctionsType = (value) => {
    return {
        type: CA_AUCTION_TYPE_SET,
        value,
    };
};

// Listing Auctions Filter
export const showListingAuctionFilters = () => {
    return {
        type: LISTING_AUCTION_FILTERS_SHOW,
    };
};

export const hideListingAuctionFilters = () => {
    return {
        type: LISTING_AUCTION_FILTERS_HIDE,
    };
};

export const setLAPriceRangeCoin = (value) => {
    return {
        type: LA_PRICE_RANGE_COIN_SET,
        value,
    };
};

export const setLAPriceRange = (value) => {
    return {
        type: LA_PRICE_RANGE_SET,
        value,
    };
};

export const setLAOnSaleIn = (value) => {
    return {
        type: LA_ON_SALE_IN_SET,
        value,
    };
};

export const setLAOnSaleInSearch = (value) => {
    return {
        type: LA_ON_SALE_IN_SEARCH_SET,
        value,
    };
};

export const setLAAuctionsType = (value) => {
    return {
        type: LA_AUCTION_TYPE_SET,
        value,
    };
};
