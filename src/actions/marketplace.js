import Axios from 'axios';
import {
    IBC_TOKENS_LIST_URL,
    urlAccountTokensTraded,
    urlAuctionBidHistory,
    urlBuyNFT,
    urlCollection,
    urlCollections,
    urlCollectionsTable,
    urlLaunchpadCollections,
    urlListings,
    urlNFT,
    urlNFTActivity,
} from '../constants/url';
import {
    BID_PERCENTAGE_SET,
    BURN_DIALOG_FAILED_SET,
    BURN_DIALOG_HIDE,
    BURN_DIALOG_SHOW,
    BURN_DIALOG_SUCCESS_SET,
    BURN_ID_SET,
    BUY_NFT_SUCCESS_DIALOG_HIDE,
    BUY_NFT_SUCCESS_DIALOG_SHOW,
    COLLECTIONS_SEARCH_SET,
    CONFIRM_DE_LIST_SET,
    CONFIRM_LISTING_SET,
    CONFIRM_TRANSFER_SET,
    DE_LIST_NFT_ERROR,
    DE_LIST_NFT_IN_PROGRESS,
    DE_LIST_NFT_SUCCESS,
    DELIST_DIALOG_HIDE,
    DELIST_DIALOG_SHOW,
    EMPTY_SINGLE_ASSET_SET,
    END_DATE_SET,
    FETCH_ACCOUNT_TOKENS_TRADED_ERROR,
    FETCH_ACCOUNT_TOKENS_TRADED_IN_PROGRESS,
    FETCH_ACCOUNT_TOKENS_TRADED_SUCCESS,
    FETCH_AUCTION_BID_HISTORY_ERROR,
    FETCH_AUCTION_BID_HISTORY_IN_PROGRESS,
    FETCH_AUCTION_BID_HISTORY_SUCCESS,
    FETCH_COLLECTION_ERROR,
    FETCH_COLLECTION_IN_PROGRESS,
    FETCH_COLLECTION_SUCCESS,
    FETCH_COLLECTIONS_ERROR,
    FETCH_COLLECTIONS_IN_PROGRESS,
    FETCH_COLLECTIONS_SUCCESS,
    FETCH_COLLECTIONS_TABLE_ERROR,
    FETCH_COLLECTIONS_TABLE_IN_PROGRESS,
    FETCH_COLLECTIONS_TABLE_SUCCESS,
    FETCH_LAUNCHPAD_COLLECTIONS_LIST_ERROR,
    FETCH_LAUNCHPAD_COLLECTIONS_LIST_IN_PROGRESS,
    FETCH_LAUNCHPAD_COLLECTIONS_LIST_SUCCESS,
    FETCH_LISTINGS_ERROR,
    FETCH_LISTINGS_IN_PROGRESS,
    FETCH_LISTINGS_SUCCESS,
    FETCH_NFT_ACTIVITY_ERROR,
    FETCH_NFT_ACTIVITY_IN_PROGRESS,
    FETCH_NFT_ACTIVITY_SUCCESS,
    FETCH_NFT_ERROR,
    FETCH_NFT_IN_PROGRESS,
    FETCH_NFT_SUCCESS,
    GRID_OPTION_SET,
    IBC_TOKENS_LIST_FETCH_ERROR,
    IBC_TOKENS_LIST_FETCH_IN_PROGRESS,
    IBC_TOKENS_LIST_FETCH_SUCCESS,
    JSON_SCHEMA_DIALOG_HIDE,
    JSON_SCHEMA_DIALOG_SHOW,
    LIST_NFT_ERROR,
    LIST_NFT_IN_PROGRESS,
    LIST_NFT_SUCCESS,
    LIST_TYPE_SET,
    LISTING_ACTIVE_SORT_SET,
    LISTING_SEARCH_SET,
    MARKETPLACE_TABS_SET,
    MENU_POPOVER_HIDE,
    MENU_POPOVER_SHOW,
    NFT_BUY_ERROR,
    NFT_BUY_IN_PROGRESS,
    NFT_BUY_SUCCESS,
    PLAYER_SET,
    RECIPENT_ACCOUNT_ADDRESS_SET,
    SELL_DIALOG_HIDE,
    SELL_DIALOG_SHOW,
    SELL_TOKEN_PRICE_SET,
    SELL_TOKEN_VALUE_SET,
    SPLIT_INFO_SET,
    SPLIT_INFO_STATUS_SET,
    START_DATE_SET,
    TRANSFER_DIALOG_HIDE,
    TRANSFER_DIALOG_SHOW,
    WHITELIST_SWITCH_SET,
    WHITELIST_VALUE_SET,
} from '../constants/marketplace';
import { LIST_NFT_URL, urlDeList } from '../constants/restURL';

export const setGridOption = (value) => {
    return {
        type: GRID_OPTION_SET,
        value,
    };
};

export const setSearchListing = (value) => {
    return {
        type: LISTING_SEARCH_SET,
        value,
    };
};

export const setSearchCollections = (value) => {
    return {
        type: COLLECTIONS_SEARCH_SET,
        value,
    };
};

export const setListingSort = (sortBy, order) => {
    return {
        type: LISTING_ACTIVE_SORT_SET,
        sortBy,
        order,
    };
};

export const setMarketPlaceTab = (value) => {
    return {
        type: MARKETPLACE_TABS_SET,
        value,
    };
};

export const showBurnDialog = (asset) => {
    return {
        type: BURN_DIALOG_SHOW,
        asset,
    };
};

export const hideBurnDialog = () => {
    return {
        type: BURN_DIALOG_HIDE,
    };
};

export const setBurnDialogSuccess = () => {
    return {
        type: BURN_DIALOG_SUCCESS_SET,
    };
};

export const setBurnDialogFailed = () => {
    return {
        type: BURN_DIALOG_FAILED_SET,
    };
};

export const showMenuPopover = (event, asset) => {
    return {
        type: MENU_POPOVER_SHOW,
        value: event.currentTarget,
        asset,
    };
};

export const hideMenuPopover = () => {
    return {
        type: MENU_POPOVER_HIDE,
    };
};

export const setBurnId = (value) => {
    return {
        type: BURN_ID_SET,
        value,
    };
};

const fetchListingsInProgress = () => {
    return {
        type: FETCH_LISTINGS_IN_PROGRESS,
    };
};

const fetchListingsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_LISTINGS_SUCCESS,
        value,
        skip,
        limit,
        total,
        variant: 'success',
    };
};

const fetchListingsError = (message) => {
    return {
        type: FETCH_LISTINGS_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchListings = (skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search, cb) => (dispatch) => {
    dispatch(fetchListingsInProgress());

    const url = urlListings(skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchListingsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result && res.data.result.list, res && res.data && res.data.result && res.data.result.count);
            }
        })
        .catch((error) => {
            dispatch(fetchListingsError(
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

const fetchCollectionsInProgress = () => {
    return {
        type: FETCH_COLLECTIONS_IN_PROGRESS,
    };
};

const fetchCollectionsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_COLLECTIONS_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchCollectionsError = (message) => {
    return {
        type: FETCH_COLLECTIONS_ERROR,
        message,
    };
};

export const fetchCollections = (address, skip, limit, searchKey) => (dispatch) => {
    dispatch(fetchCollectionsInProgress());

    const url = urlCollections(address, skip, limit, searchKey);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchCollectionsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
        })
        .catch((error) => {
            dispatch(fetchCollectionsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchCollectionsTableInProgress = () => {
    return {
        type: FETCH_COLLECTIONS_TABLE_IN_PROGRESS,
    };
};

const fetchCollectionsTableSuccess = (value, skip, limit, total, sortBy, order, searchKey) => {
    return {
        type: FETCH_COLLECTIONS_TABLE_SUCCESS,
        value,
        skip,
        limit,
        total,
        sortBy,
        order,
        searchKey,
    };
};

const fetchCollectionsTableError = (message) => {
    return {
        type: FETCH_COLLECTIONS_TABLE_ERROR,
        message,
    };
};

export const fetchCollectionsTable = (address, skip, limit, sortBy, order, searchKey) => (dispatch) => {
    dispatch(fetchCollectionsTableInProgress());

    const url = urlCollectionsTable(address, skip, limit, searchKey, sortBy, order);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchCollectionsTableSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count, sortBy, order, searchKey));
        })
        .catch((error) => {
            dispatch(fetchCollectionsTableError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchCollectionInProgress = () => {
    return {
        type: FETCH_COLLECTION_IN_PROGRESS,
    };
};

const fetchCollectionSuccess = (value) => {
    return {
        type: FETCH_COLLECTION_SUCCESS,
        value,
    };
};

const fetchCollectionError = (message) => {
    return {
        type: FETCH_COLLECTION_ERROR,
        message,
    };
};

export const fetchCollection = (id, cb) => (dispatch) => {
    dispatch(fetchCollectionInProgress());

    const url = urlCollection(id);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchCollectionSuccess(res.data && res.data.result));
            if (cb) {
                cb(res.data && res.data.result);
            }
        })
        .catch((error) => {
            dispatch(fetchCollectionError(
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

const fetchNFTSuccess = (result) => {
    return {
        type: FETCH_NFT_SUCCESS,
        result,
    };
};

const fetchNFTError = (message) => {
    return {
        type: FETCH_NFT_ERROR,
        message,
    };
};

const fetchNFTInProgress = () => {
    return {
        type: FETCH_NFT_IN_PROGRESS,
    };
};

export const fetchNFT = (id, cb) => (dispatch) => {
    dispatch(fetchNFTInProgress());

    const url = urlNFT(id);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result) {
            dispatch(fetchNFTSuccess(res.data && res.data.result));
            if (cb) {
                cb(res.data && res.data.result);
            }
        }
    }).catch((error) => {
        dispatch(fetchNFTError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
        if (cb) {
            cb(null);
        }
    });
};

const fetchNFTActivitySuccess = (result, count, skip, limit, id) => {
    return {
        type: FETCH_NFT_ACTIVITY_SUCCESS,
        result,
        total: count,
        skip,
        limit,
        id,
    };
};

const fetchNFTActivityError = (message) => {
    return {
        type: FETCH_NFT_ACTIVITY_ERROR,
        message,
    };
};

const fetchNFTActivityInProgress = () => {
    return {
        type: FETCH_NFT_ACTIVITY_IN_PROGRESS,
    };
};

export const fetchNFTActivity = (id, skip, limit) => (dispatch) => {
    dispatch(fetchNFTActivityInProgress());

    const url = urlNFTActivity(id, skip, limit);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result) {
            dispatch(fetchNFTActivitySuccess(res.data && res.data.result && res.data.result.list,
                res.data && res.data.result && res.data.result.count, skip, limit, id));
        }
    }).catch((error) => {
        dispatch(fetchNFTActivityError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};

const fetchAuctionBidHistorySuccess = (result, count, skip, limit, id) => {
    return {
        type: FETCH_AUCTION_BID_HISTORY_SUCCESS,
        result,
        total: count,
        skip,
        limit,
        id,
    };
};

const fetchAuctionBidHistoryError = (message) => {
    return {
        type: FETCH_AUCTION_BID_HISTORY_ERROR,
        message,
    };
};

const fetchAuctionBidHistoryInProgress = () => {
    return {
        type: FETCH_AUCTION_BID_HISTORY_IN_PROGRESS,
    };
};

export const fetchAuctionBidHistory = (id, skip, limit) => (dispatch) => {
    dispatch(fetchAuctionBidHistoryInProgress());

    const url = urlAuctionBidHistory(id, skip, limit);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result) {
            dispatch(fetchAuctionBidHistorySuccess(res.data && res.data.result && res.data.result.bid,
                res.data && res.data.result && res.data.result.count, skip, limit, id));
        }
    }).catch((error) => {
        dispatch(fetchAuctionBidHistoryError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};

export const setPlayer = (value) => {
    return {
        type: PLAYER_SET,
        value,
    };
};

const buyNFTInProgress = () => {
    return {
        type: NFT_BUY_IN_PROGRESS,
    };
};

const buyNFTSuccess = (value) => {
    return {
        type: NFT_BUY_SUCCESS,
        value,
    };
};

const buyNFTError = (message) => {
    return {
        type: NFT_BUY_ERROR,
        message,
    };
};

export const buyNFT = (data, id, cb) => (dispatch) => {
    dispatch(buyNFTInProgress());

    const url = urlBuyNFT(id);
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(buyNFTSuccess(res.data));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(buyNFTError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchIBCTokensListInProgress = () => {
    return {
        type: IBC_TOKENS_LIST_FETCH_IN_PROGRESS,
    };
};

const fetchIBCTokensListSuccess = (value) => {
    return {
        type: IBC_TOKENS_LIST_FETCH_SUCCESS,
        value,
    };
};

const fetchIBCTokensListError = (message) => {
    return {
        type: IBC_TOKENS_LIST_FETCH_ERROR,
        message,
    };
};

export const fetchIBCTokensList = () => (dispatch) => {
    dispatch(fetchIBCTokensListInProgress());

    Axios.get(IBC_TOKENS_LIST_URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchIBCTokensListSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchIBCTokensListError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const setEmptySingleAsset = () => {
    return {
        type: EMPTY_SINGLE_ASSET_SET,
    };
};

export const showTransferDialog = (value) => {
    return {
        type: TRANSFER_DIALOG_SHOW,
        value,
    };
};

export const hideTransferDialog = () => {
    return {
        type: TRANSFER_DIALOG_HIDE,
    };
};

export const showSellDialog = (value) => {
    return {
        type: SELL_DIALOG_SHOW,
        value,
    };
};

export const hideSellDialog = () => {
    return {
        type: SELL_DIALOG_HIDE,
    };
};

export const setRecipentAddress = (value) => {
    return {
        type: RECIPENT_ACCOUNT_ADDRESS_SET,
        value,
    };
};

export const setSellTokenPrice = (value) => {
    return {
        type: SELL_TOKEN_PRICE_SET,
        value,
    };
};

export const setBidPercentagePrice = (value) => {
    return {
        type: BID_PERCENTAGE_SET,
        value,
    };
};

export const setSellTokenValue = (value) => {
    return {
        type: SELL_TOKEN_VALUE_SET,
        value,
    };
};

const listNFTInProgress = () => {
    return {
        type: LIST_NFT_IN_PROGRESS,
    };
};

const listNFTSuccess = (value) => {
    return {
        type: LIST_NFT_SUCCESS,
        value,
    };
};

const listNFTError = (message) => {
    return {
        type: LIST_NFT_ERROR,
        message,
    };
};

export const listNFT = (data, cb) => (dispatch) => {
    dispatch(listNFTInProgress());

    Axios.post(LIST_NFT_URL, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(listNFTSuccess(res.data && res.data.result));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(listNFTError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const showDelistDialog = (value) => {
    return {
        type: DELIST_DIALOG_SHOW,
        value,
    };
};

export const hideDelistDialog = () => {
    return {
        type: DELIST_DIALOG_HIDE,
    };
};

export const showSchemaJsonDialog = (value) => {
    return {
        type: JSON_SCHEMA_DIALOG_SHOW,
        value,
    };
};

const deListNFTInProgress = () => {
    return {
        type: DE_LIST_NFT_IN_PROGRESS,
    };
};

const deListNFTSuccess = (value) => {
    return {
        type: DE_LIST_NFT_SUCCESS,
        value,
    };
};

const deListNFTError = (message) => {
    return {
        type: DE_LIST_NFT_ERROR,
        message,
    };
};

export const deListNFT = (data, id, cb) => (dispatch) => {
    dispatch(deListNFTInProgress());

    const url = urlDeList(id);
    Axios.put(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(deListNFTSuccess(res.data && res.data.result));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(deListNFTError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const hideSchemaJsonDialog = () => {
    return {
        type: JSON_SCHEMA_DIALOG_HIDE,
    };
};

const fetchAccountTokensTradedInProgress = () => {
    return {
        type: FETCH_ACCOUNT_TOKENS_TRADED_IN_PROGRESS,
    };
};

const fetchAccountTokensTradedSuccess = (value) => {
    return {
        type: FETCH_ACCOUNT_TOKENS_TRADED_SUCCESS,
        value,
    };
};

const fetchAccountTokensTradedError = (message) => {
    return {
        type: FETCH_ACCOUNT_TOKENS_TRADED_ERROR,
        message,
    };
};

export const fetchAccountTokensTraded = (id) => (dispatch) => {
    dispatch(fetchAccountTokensTradedInProgress());

    const url = urlAccountTokensTraded(id);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchAccountTokensTradedSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchAccountTokensTradedError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const showBuyNFTSuccessDialog = (value, info, hash) => {
    return {
        type: BUY_NFT_SUCCESS_DIALOG_SHOW,
        value,
        info,
        hash,
    };
};

export const hideBuyNFTSuccessDialog = () => {
    return {
        type: BUY_NFT_SUCCESS_DIALOG_HIDE,
    };
};

export const setSplitInfo = (value) => {
    return {
        type: SPLIT_INFO_SET,
        value,
    };
};

export const setSplitInfoStatus = (value) => {
    return {
        type: SPLIT_INFO_STATUS_SET,
        value,
    };
};

export const setWhiteListSwitch = (value) => {
    return {
        type: WHITELIST_SWITCH_SET,
        value,
    };
};

export const setWhiteListValue = (value) => {
    return {
        type: WHITELIST_VALUE_SET,
        value,
    };
};

export const setStartDate = (value) => {
    return {
        type: START_DATE_SET,
        value,
    };
};

export const setEndDate = (value) => {
    return {
        type: END_DATE_SET,
        value,
    };
};

export const setListType = (value) => {
    return {
        type: LIST_TYPE_SET,
        value,
    };
};

export const setConfirmListing = (open, value) => {
    return {
        type: CONFIRM_LISTING_SET,
        open,
        value,
    };
};

export const setConfirmDeList = (open, value) => {
    return {
        type: CONFIRM_DE_LIST_SET,
        open,
        value,
    };
};

export const setConfirmTransfer = (open, value) => {
    return {
        type: CONFIRM_TRANSFER_SET,
        open,
        value,
    };
};

const fetchLaunchpadCollectionsListInProgress = () => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_LIST_IN_PROGRESS,
    };
};

const fetchLaunchpadCollectionsListSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_LIST_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchLaunchpadCollectionsListError = (message) => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_LIST_ERROR,
        message,
    };
};

export const fetchLaunchpadCollectionsList = (address, skip, limit, searchKey) => (dispatch) => {
    dispatch(fetchLaunchpadCollectionsListInProgress());

    const url = urlLaunchpadCollections(address, skip, limit, searchKey);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchLaunchpadCollectionsListSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
        })
        .catch((error) => {
            dispatch(fetchLaunchpadCollectionsListError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};
