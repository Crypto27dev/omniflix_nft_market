import { combineReducers } from 'redux';
import {
    FETCH_COLLECTION_ACTIVITY_ERROR,
    FETCH_COLLECTION_ACTIVITY_IN_PROGRESS,
    FETCH_COLLECTION_ACTIVITY_SUCCESS,
    FETCH_USER_ACTIVITY_ERROR,
    FETCH_USER_ACTIVITY_IN_PROGRESS,
    FETCH_USER_ACTIVITY_SUCCESS,
} from '../constants/activity';
import { DEFAULT_LIMIT, DEFAULT_ORDER, DEFAULT_SKIP, DEFAULT_SORT_BY, DEFAULT_TOTAL } from '../config';
import { CLEAR_MY_ACCOUNT_DATA } from '../constants/myAccount';

const userActivity = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
    sortBy: DEFAULT_SORT_BY,
    order: DEFAULT_ORDER,
}, action) => {
    switch (action.type) {
    case FETCH_USER_ACTIVITY_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_USER_ACTIVITY_SUCCESS: {
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.value,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
                total: action.total,
                sortBy: action.sortBy,
                order: action.order,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.value],
                skip: action.skip,
                limit: action.limit,
                total: action.total,
                sortBy: action.sortBy,
                order: action.order,
            };
        }
    }
    case FETCH_USER_ACTIVITY_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    case CLEAR_MY_ACCOUNT_DATA:
        return {
            ...state,
            result: [],
            skip: DEFAULT_SKIP,
            limit: DEFAULT_LIMIT,
            total: DEFAULT_TOTAL,
            sortBy: DEFAULT_SORT_BY,
            order: DEFAULT_ORDER,
        };

    default:
        return state;
    }
};

const collectionActivity = (state = {
    inProgress: false,
    result: [],
    skip: DEFAULT_SKIP,
    limit: DEFAULT_LIMIT,
    total: DEFAULT_TOTAL,
    sortBy: DEFAULT_SORT_BY,
    order: DEFAULT_ORDER,
}, action) => {
    switch (action.type) {
    case FETCH_COLLECTION_ACTIVITY_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FETCH_COLLECTION_ACTIVITY_SUCCESS: {
        if (action.skip === DEFAULT_SKIP) {
            return {
                ...state,
                inProgress: false,
                result: action.value,
                skip: action.limit - DEFAULT_LIMIT,
                limit: DEFAULT_LIMIT,
                total: action.total,
                sortBy: action.sortBy,
                order: action.order,
            };
        } else {
            return {
                ...state,
                inProgress: false,
                result: [...state.result, ...action.value],
                skip: action.skip,
                limit: action.limit,
                total: action.total,
                sortBy: action.sortBy,
                order: action.order,
            };
        }
    }
    case FETCH_COLLECTION_ACTIVITY_ERROR:
        return {
            ...state,
            inProgress: false,
        };

    default:
        return state;
    }
};

export default combineReducers({
    userActivity,
    collectionActivity,
});
