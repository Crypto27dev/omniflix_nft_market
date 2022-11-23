import {
    FEE_GRANT_ALLOWANCE_ERROR,
    FEE_GRANT_ALLOWANCE_IN_PROGRESS,
    FEE_GRANT_ALLOWANCE_SUCCESS,
} from '../constants/campaign';
import { FEE_GRANT_ALLOWANCE_URL } from '../constants/url';
import Axios from 'axios';

const feeGrantAllowanceInProgress = () => {
    return {
        type: FEE_GRANT_ALLOWANCE_IN_PROGRESS,
    };
};

const feeGrantAllowanceSuccess = (value, message) => {
    return {
        type: FEE_GRANT_ALLOWANCE_SUCCESS,
        value,
        message,
        variant: 'success',
    };
};

const feeGrantAllowanceError = (message) => {
    return {
        type: FEE_GRANT_ALLOWANCE_ERROR,
        message,
        variant: 'error',
    };
};

export const feeGrantAllowanceClaim = (cb) => (dispatch) => {
    dispatch(feeGrantAllowanceInProgress());

    Axios.get(FEE_GRANT_ALLOWANCE_URL, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Bearer ' + localStorage.getItem('acToken_of_nucleus'),
        },
    })
        .then((res) => {
            dispatch(feeGrantAllowanceSuccess(res.data, 'Success'));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(feeGrantAllowanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};
