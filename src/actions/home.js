import { STATS_URL, urlCollections, urlLaunchpadCollections } from '../constants/url';
import Axios from 'axios';
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

const fetchHomeCollectionsInProgress = () => {
    return {
        type: FETCH_HOME_COLLECTIONS_IN_PROGRESS,
    };
};

const fetchHomeCollectionsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_HOME_COLLECTIONS_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchHomeCollectionsError = (message) => {
    return {
        type: FETCH_HOME_COLLECTIONS_ERROR,
        message,
    };
};

export const fetchHomeCollections = (address, skip, limit, searchKey) => (dispatch) => {
    dispatch(fetchHomeCollectionsInProgress());

    const url = urlCollections(address, skip, limit, searchKey);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchHomeCollectionsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
        })
        .catch((error) => {
            dispatch(fetchHomeCollectionsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const fetchLaunchpadCollectionsInProgress = () => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_IN_PROGRESS,
    };
};

const fetchLaunchpadCollectionsSuccess = (value, skip, limit, total) => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_SUCCESS,
        value,
        skip,
        limit,
        total,
    };
};

const fetchLaunchpadCollectionsError = (message) => {
    return {
        type: FETCH_LAUNCHPAD_COLLECTIONS_ERROR,
        message,
    };
};

export const fetchLaunchpadCollections = (address, skip, limit, searchKey) => (dispatch) => {
    dispatch(fetchLaunchpadCollectionsInProgress());

    const url = urlLaunchpadCollections(address, skip, limit, searchKey);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchLaunchpadCollectionsSuccess(res.data && res.data.result && res.data.result.list,
                skip, limit, res && res.data && res.data.result && res.data.result.count));
        })
        .catch((error) => {
            dispatch(fetchLaunchpadCollectionsError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

export const setSearchLaunchpadCollection = (value) => {
    return {
        type: LAUNCHPAD_COLLECTION_SEARCH_SET,
        value,
    };
};

const fetchStatsSuccess = (result) => {
    return {
        type: FETCH_STATS_SUCCESS,
        result,
    };
};

const fetchStatsError = (message) => {
    return {
        type: FETCH_STATS_ERROR,
        message,
    };
};

const fetchStatsInProgress = () => {
    return {
        type: FETCH_STATS_IN_PROGRESS,
    };
};

export const fetchStats = () => (dispatch) => {
    dispatch(fetchStatsInProgress());

    Axios.get(STATS_URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result && res.data.result) {
            dispatch(fetchStatsSuccess(res.data && res.data.result));
        }
    }).catch((error) => {
        dispatch(fetchStatsError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};
