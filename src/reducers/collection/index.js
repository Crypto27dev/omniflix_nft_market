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
import { combineReducers } from 'redux';
import { DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_TOTAL } from '../../config';
import filters from './filters';

const collectionNFTsSort = (state = {
    sortBy: 'created_at',
    order: '',
}, action) => {
    if (action.type === COLLECTION_NFT_S_SORT_SET) {
        return {
            ...state,
            sortBy: action.sortBy,
            order: action.order,
        };
    }

    return state;
};

const collectionAuctionsSort = (state = {
    sortBy: 'created_at',
    order: '',
}, action) => {
    if (action.type === COLLECTION_AUCTIONS_SORT_SET) {
        return {
            ...state,
            sortBy: action.sortBy,
            order: action.order,
        };
    }

    return state;
};

const listedCollectionNFTs = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_LISTED_COLLECTION_NFT_S_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_LISTED_COLLECTION_NFT_S_SUCCESS: {
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
    case FETCH_LISTED_COLLECTION_NFT_S_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const nonListedCollectionNFTs = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_NON_LISTED_COLLECTION_NFT_S_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_NON_LISTED_COLLECTION_NFT_S_SUCCESS: {
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
    case FETCH_NON_LISTED_COLLECTION_NFT_S_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const collectionMyNFTs = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case COLLECTION_MY_NFT_S_FETCH_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case COLLECTION_MY_NFT_S_FETCH_SUCCESS: {
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
    case COLLECTION_MY_NFT_S_FETCH_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const listedSearch = (state = {
    value: '',
}, action) => {
    if (action.type === LISTED_SEARCH_SET) {
        return {
            value: action.value,
        };
    }

    return state;
};

const nonListedSearch = (state = {
    value: '',
}, action) => {
    if (action.type === NON_LISTED_SEARCH_SET) {
        return {
            value: action.value,
        };
    }

    return state;
};

const collectionAuctionSearch = (state = {
    value: '',
}, action) => {
    if (action.type === COLLECTION_AUCTION_SEARCH_SET) {
        return {
            value: action.value,
        };
    }

    return state;
};

const auctions = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_COLLECTION_AUCTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_COLLECTION_AUCTIONS_SUCCESS: {
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
    case FETCH_COLLECTION_AUCTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    collectionNFTsSort,
    collectionAuctionsSort,
    listedCollectionNFTs,
    nonListedCollectionNFTs,
    listedSearch,
    nonListedSearch,
    collectionAuctionSearch,
    collectionMyNFTs,
    auctions,
    filters,
});
