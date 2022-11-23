import {
    FETCH_COLLECTION_ACTIVITY_ERROR,
    FETCH_COLLECTION_ACTIVITY_IN_PROGRESS,
    FETCH_COLLECTION_ACTIVITY_SUCCESS,
    FETCH_USER_ACTIVITY_ERROR,
    FETCH_USER_ACTIVITY_IN_PROGRESS,
    FETCH_USER_ACTIVITY_SUCCESS,
} from '../constants/activity';
import { urlCollectionActivity, urlUserActivity } from '../constants/url';
import Axios from 'axios';

const fetchUserActivitySuccess = (value, skip, limit, total, sortBy, order) => {
    return {
        type: FETCH_USER_ACTIVITY_SUCCESS,
        value,
        skip,
        limit,
        total,
        sortBy,
        order,
    };
};

const fetchUserActivityError = (message) => {
    return {
        type: FETCH_USER_ACTIVITY_ERROR,
        message,
    };
};

const fetchUserActivityInProgress = () => {
    return {
        type: FETCH_USER_ACTIVITY_IN_PROGRESS,
    };
};

export const fetchUserActivity = (address, skip, limit, sortBy, order) => (dispatch) => {
    dispatch(fetchUserActivityInProgress());

    const url = urlUserActivity(address, skip, limit, sortBy, order);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data) {
            dispatch(fetchUserActivitySuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count, sortBy, order));
        }
    }).catch((error) => {
        dispatch(fetchUserActivityError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};

const fetchCollectionActivitySuccess = (value, skip, limit, total, sortBy, order) => {
    return {
        type: FETCH_COLLECTION_ACTIVITY_SUCCESS,
        value,
        skip,
        limit,
        total,
        sortBy,
        order,
    };
};

const fetchCollectionActivityError = (message) => {
    return {
        type: FETCH_COLLECTION_ACTIVITY_ERROR,
        message,
    };
};

const fetchCollectionActivityInProgress = () => {
    return {
        type: FETCH_COLLECTION_ACTIVITY_IN_PROGRESS,
    };
};

export const fetchCollectionActivity = (id, skip, limit, sortBy, order) => (dispatch) => {
    dispatch(fetchCollectionActivityInProgress());

    const url = urlCollectionActivity(id, skip, limit, sortBy, order);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data) {
            dispatch(fetchCollectionActivitySuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count, sortBy, order));
        }
    }).catch((error) => {
        dispatch(fetchCollectionActivityError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};
