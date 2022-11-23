import { combineReducers } from 'redux';
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
import { DEFAULT_LIMIT, DEFAULT_ORDER, DEFAULT_SKIP, DEFAULT_SORT_BY, DEFAULT_TOTAL } from '../config';

const gridOption = (state = {
    value: true,
}, action) => {
    if (action.type === GRID_OPTION_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const listingSearch = (state = {
    value: '',
}, action) => {
    if (action.type === LISTING_SEARCH_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const collectionsSearch = (state = {
    value: '',
}, action) => {
    if (action.type === COLLECTIONS_SEARCH_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const listingSort = (state = {
    sortBy: 'created_at',
    order: '',
}, action) => {
    if (action.type === LISTING_ACTIVE_SORT_SET) {
        return {
            ...state,
            sortBy: action.sortBy,
            order: action.order,
        };
    }

    return state;
};

const player = (state = null, action) => {
    if (action.type === PLAYER_SET) {
        return action.value;
    }

    return state;
};

const ibcTokensList = (state = {
    inProgress: false,
    value: [],
}, action) => {
    switch (action.type) {
    case IBC_TOKENS_LIST_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case IBC_TOKENS_LIST_FETCH_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case IBC_TOKENS_LIST_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const transferDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case TRANSFER_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case TRANSFER_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const sellDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case SELL_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case SELL_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const recipientAddress = (state = '', action) => {
    if (action.type === RECIPENT_ACCOUNT_ADDRESS_SET) {
        return action.value;
    }

    return state;
};

const sellTokenPrice = (state = '', action) => {
    if (action.type === SELL_TOKEN_PRICE_SET) {
        return action.value;
    } else if (action.type === SELL_DIALOG_HIDE) {
        return '';
    }

    return state;
};

const sellTokenValue = (state = {
    value: {},
}, action) => {
    if (action.type === SELL_TOKEN_VALUE_SET) {
        return {
            ...state,
            value: action.value,
        };
    } else if (action.type === SELL_DIALOG_HIDE) {
        return {
            ...state,
            value: {},
        };
    }

    return state;
};

const bidPercentage = (state = '', action) => {
    switch (action.type) {
    case BID_PERCENTAGE_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return '';
    default:
        return state;
    }
};

const newListNFT = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case LIST_NFT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case LIST_NFT_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case LIST_NFT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const delistDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case DELIST_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case DELIST_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const deList = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case DE_LIST_NFT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case DE_LIST_NFT_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case DE_LIST_NFT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const jsonSchemaDialog = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case JSON_SCHEMA_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
        };
    case JSON_SCHEMA_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const listings = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: null,
}, action) => {
    switch (action.type) {
    case FETCH_LISTINGS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_LISTINGS_SUCCESS: {
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
    case FETCH_LISTINGS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const collections = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_COLLECTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_COLLECTIONS_SUCCESS: {
        if (action.skip === DEFAULT_SKIP && action.limit === DEFAULT_LIMIT) {
            return {
                ...state,
                inProgress: false,
                result: action.value,
                skip: action.skip,
                limit: action.limit,
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
    case FETCH_COLLECTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const tableCollections = (state = {
    inProgress: false,
    result: [],
    skip: 0,
    limit: 10,
    total: DEFAULT_TOTAL,
    sortBy: DEFAULT_SORT_BY,
    order: DEFAULT_ORDER,
    searchKey: '',
}, action) => {
    switch (action.type) {
    case FETCH_COLLECTIONS_TABLE_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_COLLECTIONS_TABLE_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.value,
            skip: action.skip,
            limit: action.limit,
            total: action.total,
            sortBy: action.sortBy,
            order: action.order,
            searchKey: action.searchKey,
        };
    }
    case FETCH_COLLECTIONS_TABLE_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const collection = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FETCH_COLLECTION_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_COLLECTION_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    }
    case FETCH_COLLECTION_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const nftDetails = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FETCH_NFT_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_NFT_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.result,
        };
    }
    case FETCH_NFT_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const nftActivities = (state = {
    result: [],
    inProgress: false,
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
    id: null,
}, action) => {
    switch (action.type) {
    case FETCH_NFT_ACTIVITY_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_NFT_ACTIVITY_SUCCESS: {
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.result,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
                total: action.total,
                id: action.id,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.result],
                skip: action.skip,
                limit: action.limit,
                total: action.total,
                id: action.id,
            };
        }
    }
    case FETCH_NFT_ACTIVITY_ERROR:
        return {
            ...state,
            inProgress: false,
            id: null,
        };
    default:
        return state;
    }
};

const auctionBidHistory = (state = {
    result: [],
    inProgress: false,
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
    id: null,
}, action) => {
    switch (action.type) {
    case FETCH_AUCTION_BID_HISTORY_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_AUCTION_BID_HISTORY_SUCCESS: {
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.result,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
                total: action.total,
                id: action.id,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.result],
                skip: action.skip,
                limit: action.limit,
                total: action.total,
                id: action.id,
            };
        }
    }
    case FETCH_AUCTION_BID_HISTORY_ERROR:
        return {
            ...state,
            inProgress: false,
            id: null,
        };
    default:
        return state;
    }
};

const accountTokensTraded = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case FETCH_ACCOUNT_TOKENS_TRADED_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_ACCOUNT_TOKENS_TRADED_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    }
    case FETCH_ACCOUNT_TOKENS_TRADED_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const buyNFTSuccessDialog = (state = {
    open: false,
    value: '',
    info: {},
    hash: '',
}, action) => {
    switch (action.type) {
    case BUY_NFT_SUCCESS_DIALOG_SHOW:
        return {
            open: true,
            value: action.value,
            info: action.info,
            hash: action.hash,
        };
    case BUY_NFT_SUCCESS_DIALOG_HIDE:
        return {
            open: false,
            value: '',
            info: {},
            hash: '',
        };
    default:
        return state;
    }
};

const buyNFT = (state = {
    result: {},
    inProgress: false,
}, action) => {
    switch (action.type) {
    case NFT_BUY_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case NFT_BUY_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.value,
        };
    }
    case NFT_BUY_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const splitInfo = (state = {
    status: false,
    value: [],
}, action) => {
    switch (action.type) {
    case SPLIT_INFO_STATUS_SET: {
        if (action.value && state.value && Object.keys(state.value).length === 0) {
            return {
                status: action.value,
                value: [{
                    address: '',
                    weight: '',
                }],
            };
        } else if (!action.value) {
            return {
                status: action.value,
                value: [],
            };
        } else {
            return {
                ...state,
                status: action.value,
            };
        }
    }
    case SPLIT_INFO_SET:
        return {
            ...state,
            value: action.value,
        };
    case SELL_DIALOG_HIDE:
        return {
            status: false,
            value: [],
        };
    default:
        return state;
    }
};

const whiteListSwitch = (state = false, action) => {
    switch (action.type) {
    case WHITELIST_SWITCH_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return false;
    default:
        return state;
    }
};

const whiteListValue = (state = [], action) => {
    switch (action.type) {
    case WHITELIST_VALUE_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return [];
    default:
        return state;
    }
};

const startDate = (state = null, action) => {
    switch (action.type) {
    case START_DATE_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return null;
    default:
        return state;
    }
};

const endDate = (state = null, action) => {
    switch (action.type) {
    case END_DATE_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return null;
    default:
        return state;
    }
};

const confirmListing = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case CONFIRM_LISTING_SET:
        return {
            open: action.open,
            value: action.value,
        };
    case SELL_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const confirmDeList = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case CONFIRM_DE_LIST_SET:
        return {
            open: action.open,
            value: action.value,
        };
    case DELIST_DIALOG_SHOW:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const confirmTransfer = (state = {
    open: false,
    value: {},
}, action) => {
    switch (action.type) {
    case CONFIRM_TRANSFER_SET:
        return {
            open: action.open,
            value: action.value,
        };
    case TRANSFER_DIALOG_HIDE:
        return {
            open: false,
            value: {},
        };

    default:
        return state;
    }
};

const listType = (state = 'fixed-price', action) => {
    switch (action.type) {
    case LIST_TYPE_SET:
        return action.value;
    case SELL_DIALOG_HIDE:
        return 'fixed-price';
    default:
        return state;
    }
};

const marketPlaceTab = (state = {
    value: 'auctions',
}, action) => {
    if (action.type === MARKETPLACE_TABS_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const burnDialog = (state = {
    open: false,
    asset: {},
    success: false,
    failed: false,
}, action) => {
    switch (action.type) {
    case BURN_DIALOG_SHOW:
        return {
            ...state,
            open: true,
            asset: action.asset,
        };
    case BURN_DIALOG_SUCCESS_SET:
        return {
            ...state,
            success: true,
        };
    case BURN_DIALOG_FAILED_SET:
        return {
            ...state,
            failed: true,
        };
    case BURN_DIALOG_HIDE:
        return {
            ...state,
            open: false,
            asset: {},
            success: false,
            failed: false,
        };
    default:
        return state;
    }
};

const burnID = (state = '', action) => {
    switch (action.type) {
    case BURN_ID_SET:
        return action.value;
    case BURN_DIALOG_HIDE:
        return '';

    default:
        return state;
    }
};

const menuPopover = (state = {
    anchorEl: null,
    asset: {},
}, action) => {
    switch (action.type) {
    case MENU_POPOVER_SHOW:
        return {
            anchorEl: action.value,
            asset: action.asset,
        };
    case MENU_POPOVER_HIDE:
        return {
            anchorEl: action.value,
            asset: {},
        };

    default:
        return state;
    }
};

const launchpadCollections = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_LAUNCHPAD_COLLECTIONS_LIST_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_LAUNCHPAD_COLLECTIONS_LIST_SUCCESS: {
        if (action.skip === DEFAULT_SKIP && action.limit === DEFAULT_LIMIT) {
            return {
                ...state,
                inProgress: false,
                result: action.value,
                skip: action.skip,
                limit: action.limit,
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
    case FETCH_LAUNCHPAD_COLLECTIONS_LIST_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    player,
    listingSort,
    ibcTokensList,
    transferDialog,
    sellDialog,
    recipientAddress,
    sellTokenPrice,
    sellTokenValue,
    newListNFT,
    delistDialog,
    deList,
    jsonSchemaDialog,
    listings,
    collection,
    nftDetails,
    accountTokensTraded,
    collections,
    buyNFTSuccessDialog,
    tableCollections,
    gridOption,
    buyNFT,
    listingSearch,
    collectionsSearch,
    splitInfo,
    confirmListing,
    confirmDeList,
    confirmTransfer,
    nftActivities,
    auctionBidHistory,
    bidPercentage,
    whiteListSwitch,
    whiteListValue,
    startDate,
    endDate,
    listType,
    marketPlaceTab,
    burnDialog,
    menuPopover,
    burnID,
    launchpadCollections,
});
