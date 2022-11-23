import { DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_TOTAL } from '../config';
import { combineReducers } from 'redux';
import {
    FETCH_HOME_COLLECTIONS_ERROR,
    FETCH_HOME_COLLECTIONS_IN_PROGRESS,
    FETCH_HOME_COLLECTIONS_SUCCESS,
    FETCH_LAUNCHPAD_COLLECTIONS_ERROR,
    FETCH_LAUNCHPAD_COLLECTIONS_IN_PROGRESS,
    FETCH_LAUNCHPAD_COLLECTIONS_SUCCESS,
    FETCH_STATS_ERROR,
    FETCH_STATS_IN_PROGRESS,
    FETCH_STATS_SUCCESS,
    LAUNCHPAD_COLLECTION_SEARCH_SET,
} from '../constants/home';

const homeCollections = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
}, action) => {
    switch (action.type) {
    case FETCH_HOME_COLLECTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_HOME_COLLECTIONS_SUCCESS: {
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
    case FETCH_HOME_COLLECTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
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
    case FETCH_LAUNCHPAD_COLLECTIONS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_LAUNCHPAD_COLLECTIONS_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.value,
            skip: action.skip,
            limit: action.limit,
            total: action.total,
        };
    }
    case FETCH_LAUNCHPAD_COLLECTIONS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

const launchpadCollectionSearch = (state = {
    value: '',
}, action) => {
    if (action.type === LAUNCHPAD_COLLECTION_SEARCH_SET) {
        return {
            ...state,
            value: action.value,
        };
    }

    return state;
};

const stats = (state = {
    inProgress: false,
    result: {},
}, action) => {
    switch (action.type) {
    case FETCH_STATS_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_STATS_SUCCESS: {
        return {
            ...state,
            inProgress: false,
            result: action.result,
        };
    }
    case FETCH_STATS_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    homeCollections,
    launchpadCollections,
    launchpadCollectionSearch,
    stats,
});
