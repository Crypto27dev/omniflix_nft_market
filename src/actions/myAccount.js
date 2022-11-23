import {
    AMOUNT_VALUE_SET,
    CLEAR_MY_ACCOUNT_DATA,
    DEPOSITE_DIALOG_HIDE,
    DEPOSITE_DIALOG_SHOW,
    FETCH_OWNER_COLLECTIONS_ERROR,
    FETCH_OWNER_COLLECTIONS_IN_PROGRESS,
    FETCH_OWNER_COLLECTIONS_SUCCESS,
    FETCH_OWNER_NFT_S_ERROR,
    FETCH_OWNER_NFT_S_IN_PROGRESS,
    FETCH_OWNER_NFT_S_SUCCESS,
    FETCH_USER_BALANCE_ERROR,
    FETCH_USER_BALANCE_IN_PROGRESS,
    FETCH_USER_BALANCE_SUCCESS,
    FETCH_USER_COLLECTIONS_ERROR,
    FETCH_USER_COLLECTIONS_IN_PROGRESS,
    FETCH_USER_COLLECTIONS_SUCCESS,
    FETCH_USER_NFT_S_ERROR,
    FETCH_USER_NFT_S_IN_PROGRESS,
    FETCH_USER_NFT_S_SUCCESS,
    NFT_TRANSFER_ERROR,
    NFT_TRANSFER_IN_PROGRESS,
    NFT_TRANSFER_SUCCESS,
    WITHDRAW_DIALOG_HIDE,
    WITHDRAW_DIALOG_SHOW,
} from '../constants/myAccount';
import { urlOwnerCollections, urlOwnerNFTs, urlUserCollections, urlUserNFTs } from '../constants/url';
import Axios from 'axios';
import { urlFetchBalance, urlTransferNFT } from '../constants/restURL';

const fetchOwnerCollectionsSuccess = (result, count) => {
    return {
        type: FETCH_OWNER_COLLECTIONS_SUCCESS,
        result,
        count,
    };
};

const fetchOwnerCollectionsError = (message) => {
    return {
        type: FETCH_OWNER_COLLECTIONS_ERROR,
        message,
    };
};

const fetchOwnerCollectionsInProgress = () => {
    return {
        type: FETCH_OWNER_COLLECTIONS_IN_PROGRESS,
    };
};

export const fetchOwnerCollections = (address) => (dispatch) => {
    dispatch(fetchOwnerCollectionsInProgress());

    const url = urlOwnerCollections(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result && res.data.result) {
            dispatch(fetchOwnerCollectionsSuccess(res.data && res.data.result.list, res.data && res.data.result.count));
        }
    }).catch((error) => {
        dispatch(fetchOwnerCollectionsError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};

const fetchOwnerNFTsSuccess = (result, count) => {
    return {
        type: FETCH_OWNER_NFT_S_SUCCESS,
        result,
        count,
    };
};

const fetchOwnerNFTsError = (message) => {
    return {
        type: FETCH_OWNER_NFT_S_ERROR,
        message,
    };
};

const fetchOwnerNFTsInProgress = () => {
    return {
        type: FETCH_OWNER_NFT_S_IN_PROGRESS,
    };
};

export const fetchOwnerNFTs = (address) => (dispatch) => {
    dispatch(fetchOwnerNFTsInProgress());

    const url = urlOwnerNFTs(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result && res.data.result) {
            dispatch(fetchOwnerNFTsSuccess(res.data && res.data.result.list, res.data && res.data.result.count));
        }
    }).catch((error) => {
        dispatch(fetchOwnerNFTsError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
    });
};

const fetchUserCollectionsSuccess = (result, skip, limit, count) => {
    return {
        type: FETCH_USER_COLLECTIONS_SUCCESS,
        result,
        skip,
        limit,
        count,
    };
};

const fetchUserCollectionsError = (message) => {
    return {
        type: FETCH_USER_COLLECTIONS_ERROR,
        message,
    };
};

const fetchUserCollectionsInProgress = () => {
    return {
        type: FETCH_USER_COLLECTIONS_IN_PROGRESS,
    };
};

export const fetchUserCollections = (address, skip, limit, cb) => (dispatch) => {
    dispatch(fetchUserCollectionsInProgress());

    const url = urlUserCollections(address, skip, limit);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result && res.data.result) {
            dispatch(fetchUserCollectionsSuccess(res.data && res.data.result.list,
                skip, limit, res.data && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result.list, res.data && res.data.result.count);
            }
        }
    }).catch((error) => {
        dispatch(fetchUserCollectionsError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
        if (cb) {
            cb(null);
        }
    });
};

const fetchUserNFTsSuccess = (result, skip, limit, count) => {
    return {
        type: FETCH_USER_NFT_S_SUCCESS,
        result,
        skip,
        limit,
        count,
    };
};

const fetchUserNFTsError = (message) => {
    return {
        type: FETCH_USER_NFT_S_ERROR,
        message,
    };
};

const fetchUserNFTsInProgress = () => {
    return {
        type: FETCH_USER_NFT_S_IN_PROGRESS,
    };
};

export const fetchUserNFTs = (address, skip, limit, cb) => (dispatch) => {
    dispatch(fetchUserNFTsInProgress());

    const url = urlUserNFTs(address, skip, limit);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((res) => {
        if (res && res.data && res.data.result && res.data.result) {
            dispatch(fetchUserNFTsSuccess(res.data && res.data.result.list,
                skip, limit, res.data && res.data.result.count));
            if (cb) {
                cb(res.data && res.data.result.list, res.data && res.data.result.count);
            }
        }
    }).catch((error) => {
        dispatch(fetchUserNFTsError(
            error.response
                ? error.response.data.message
                : error.message,
        ));
        if (cb) {
            cb(null);
        }
    });
};

const fetchUserBalanceInProgress = () => {
    return {
        type: FETCH_USER_BALANCE_IN_PROGRESS,
    };
};

const fetchUserBalanceSuccess = (value) => {
    return {
        type: FETCH_USER_BALANCE_SUCCESS,
        value,
    };
};

const fetchUserBalanceError = (message) => {
    return {
        type: FETCH_USER_BALANCE_ERROR,
        message,
    };
};

export const fetchUserBalance = (address, cb) => (dispatch) => {
    dispatch(fetchUserBalanceInProgress());

    const url = urlFetchBalance(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchUserBalanceSuccess(res.data && res.data.result));
            if (cb) {
                cb(res.data && res.data.result);
            }
        })
        .catch((error) => {
            dispatch(fetchUserBalanceError(
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

export const showDepositeDialog = (value) => {
    return {
        type: DEPOSITE_DIALOG_SHOW,
        value,
    };
};

export const hideDepositeDialog = () => {
    return {
        type: DEPOSITE_DIALOG_HIDE,
    };
};

export const showWithdrawDialog = (value) => {
    return {
        type: WITHDRAW_DIALOG_SHOW,
        value,
    };
};

export const hideWithdrawDialog = () => {
    return {
        type: WITHDRAW_DIALOG_HIDE,
    };
};

export const setAmountValue = (value) => {
    return {
        type: AMOUNT_VALUE_SET,
        value,
    };
};

const transferNFTInProgress = () => {
    return {
        type: NFT_TRANSFER_IN_PROGRESS,
    };
};

const transferNFTSuccess = (value) => {
    return {
        type: NFT_TRANSFER_SUCCESS,
        value,
    };
};

const transferNFTError = (message) => {
    return {
        type: NFT_TRANSFER_ERROR,
        message,
    };
};

export const transferNFT = (data, denomID, onftId, cb) => (dispatch) => {
    dispatch(transferNFTInProgress());

    const url = urlTransferNFT(denomID, onftId);
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(transferNFTSuccess(res.data));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(transferNFTError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const clearMyAccountData = () => {
    return {
        type: CLEAR_MY_ACCOUNT_DATA,
    };
};
