import {
    COLLECTION_AUCTION_SEARCH_SET,
    COLLECTION_AUCTIONS_SORT_SET,
    COLLECTION_MY_NFT_S_FETCH_ERROR,
    COLLECTION_MY_NFT_S_FETCH_IN_PROGRESS,
    COLLECTION_MY_NFT_S_FETCH_SUCCESS,
    COLLECTION_NFT_S_SORT_SET,
    FETCH_COLLECTION_AUCTIONS_ERROR,
    FETCH_COLLECTION_AUCTIONS_IN_PROGRESS,
    FETCH_COLLECTION_AUCTIONS_SUCCESS,
    FETCH_LISTED_COLLECTION_NFT_S_ERROR,
    FETCH_LISTED_COLLECTION_NFT_S_IN_PROGRESS,
    FETCH_LISTED_COLLECTION_NFT_S_SUCCESS,
    FETCH_NON_LISTED_COLLECTION_NFT_S_ERROR,
    FETCH_NON_LISTED_COLLECTION_NFT_S_IN_PROGRESS,
    FETCH_NON_LISTED_COLLECTION_NFT_S_SUCCESS,
    LISTED_SEARCH_SET,
    NON_LISTED_SEARCH_SET,
} from '../../constants/collections';
import {
    urlCollectionAuction,
    urlCollectionMyNfts,
    urlListedCollectionNfts,
    urlNonListedCollectionNfts,
} from '../../constants/url';
import Axios from 'axios';

export const setCollectionNFTsSort = (sortBy, order) => {
    return {
        type: COLLECTION_NFT_S_SORT_SET,
        sortBy,
        order,
    };
};

export const setCollectionAuctionsSort = (sortBy, order) => {
    return {
        type: COLLECTION_AUCTIONS_SORT_SET,
        sortBy,
        order,
    };
};

const fetchListedCollectionNFTsInProgress = () => {
    return {
        type: FETCH_LISTED_COLLECTION_NFT_S_IN_PROGRESS,
    };
};

const fetchListedCollectionNFTsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_LISTED_COLLECTION_NFT_S_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchListedCollectionNFTsError = (message) => {
    return {
        type: FETCH_LISTED_COLLECTION_NFT_S_ERROR,
        message,
    };
};

export const fetchListedCollectionNFTs = (id, skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search, cb) => (dispatch) => {
    dispatch(fetchListedCollectionNFTsInProgress());

    const url = urlListedCollectionNfts(id, skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchListedCollectionNFTsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result && res.data.result.list, res && res.data && res.data.result && res.data.result.count);
            }
        })
        .catch((error) => {
            dispatch(fetchListedCollectionNFTsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            if (cb) {
                cb(null);
            }
        });
};

const fetchNonListedCollectionNFTsInProgress = () => {
    return {
        type: FETCH_NON_LISTED_COLLECTION_NFT_S_IN_PROGRESS,
    };
};

const fetchNonListedCollectionNFTsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_NON_LISTED_COLLECTION_NFT_S_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchNonListedCollectionNFTsError = (message) => {
    return {
        type: FETCH_NON_LISTED_COLLECTION_NFT_S_ERROR,
        message,
    };
};

export const fetchNonListedCollectionNFTs = (id, skip, limit, search, cb) => (dispatch) => {
    dispatch(fetchNonListedCollectionNFTsInProgress());

    const url = urlNonListedCollectionNfts(id, skip, limit, search);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchNonListedCollectionNFTsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result && res.data.result.list, res && res.data && res.data.result && res.data.result.count);
            }
        })
        .catch((error) => {
            dispatch(fetchNonListedCollectionNFTsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            if (cb) {
                cb(null);
            }
        });
};

export const setListedSearch = (value) => {
    return {
        type: LISTED_SEARCH_SET,
        value,
    };
};

export const setNonListedSearch = (value) => {
    return {
        type: NON_LISTED_SEARCH_SET,
        value,
    };
};

export const setCollectionAuctionSearch = (value) => {
    return {
        type: COLLECTION_AUCTION_SEARCH_SET,
        value,
    };
};

const fetchCollectionMyNFTsInProgress = () => {
    return {
        type: COLLECTION_MY_NFT_S_FETCH_IN_PROGRESS,
    };
};

const fetchCollectionMyNFTsSuccess = (value, skip, limit, total) => {
    return {
        type: COLLECTION_MY_NFT_S_FETCH_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchCollectionMyNFTsError = (message) => {
    return {
        type: COLLECTION_MY_NFT_S_FETCH_ERROR,
        message,
    };
};

export const fetchCollectionMyNFTs = (id, owner, skip, limit, cb) => (dispatch) => {
    dispatch(fetchCollectionMyNFTsInProgress());

    const url = urlCollectionMyNfts(id, owner, skip, limit);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res && res.data && res.data.result && res.data.result) {
                dispatch(fetchCollectionMyNFTsSuccess(res.data && res.data.result.list,
                    skip, limit, res.data && res.data.result && res.data.result.count));
                if (cb) {
                    cb(res.data && res.data.result.list, res.data.result && res.data.result.count);
                }
            }
        })
        .catch((error) => {
            dispatch(fetchCollectionMyNFTsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            if (cb) {
                cb(null);
            }
        });
};

const fetchCollectionAuctionsInProgress = () => {
    return {
        type: FETCH_COLLECTION_AUCTIONS_IN_PROGRESS,
    };
};

const fetchCollectionAuctionsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_COLLECTION_AUCTIONS_SUCCESS,
        value,
        skip,
        limit,
        total,
        variant: 'success',
    };
};

const fetchCollectionAuctionsError = (message) => {
    return {
        type: FETCH_COLLECTION_AUCTIONS_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchCollectionAuctions = (id, skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search, cb) => (dispatch) => {
    dispatch(fetchCollectionAuctionsInProgress());

    const url = urlCollectionAuction(id, skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchCollectionAuctionsSuccess(res.data && res.data.result && res.data.result.auction,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result && res.data.result.auction, res && res.data && res.data.result && res.data.result.count);
            }
        })
        .catch((error) => {
            dispatch(fetchCollectionAuctionsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            if (cb) {
                cb(null);
            }
        });
};
