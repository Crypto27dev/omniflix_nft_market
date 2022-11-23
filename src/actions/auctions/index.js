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
import { urlAuctionListings } from '../../constants/url';
import Axios from 'axios';

export const showPlaceBidDialog = (value) => {
    return {
        type: PLACE_BID_DIALOG_SHOW,
        value,
    };
};

export const hidePlaceBidDialog = () => {
    return {
        type: PLACE_BID_DIALOG_HIDE,
    };
};

export const setSuccessDialog = (hash) => {
    return {
        type: PLACE_BID_SUCCESS_SET,
        hash,
    };
};

export const setFailDialog = () => {
    return {
        type: PLACE_BID_FAIL_SET,
    };
};

const fetchAuctionsListingsInProgress = () => {
    return {
        type: FETCH_AUCTION_LISTINGS_IN_PROGRESS,
    };
};

const fetchAuctionsListingsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_AUCTION_LISTINGS_SUCCESS,
        value,
        skip,
        limit,
        total,
        variant: 'success',
    };
};

const fetchAuctionsListingsError = (message) => {
    return {
        type: FETCH_AUCTION_LISTINGS_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchAuctionsListings = (skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search, cb) => (dispatch) => {
    dispatch(fetchAuctionsListingsInProgress());

    const url = urlAuctionListings(skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchAuctionsListingsSuccess(res.data && res.data.result && res.data.result.auction,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result && res.data.result.auction, res && res.data && res.data.result && res.data.result.count);
            }
        })
        .catch((error) => {
            dispatch(fetchAuctionsListingsError(
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

export const setSearchAuction = (value) => {
    return {
        type: AUCTIONS_SEARCH_SET,
        value,
    };
};

export const setAuctionSort = (sortBy, order) => {
    return {
        type: AUCTIONS_SORT_SET,
        sortBy,
        order,
    };
};
