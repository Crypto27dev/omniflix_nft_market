import { combineReducers } from 'redux';
import {
    FEE_GRANT_ALLOWANCE_ERROR,
    FEE_GRANT_ALLOWANCE_IN_PROGRESS,
    FEE_GRANT_ALLOWANCE_SUCCESS,
} from '../constants/campaign';

const feeGrant = (state = {
    inProgress: false,
    value: {},
}, action) => {
    switch (action.type) {
    case FEE_GRANT_ALLOWANCE_IN_PROGRESS:
        return {
            ...state,
            inProgress: true,
        };
    case FEE_GRANT_ALLOWANCE_SUCCESS:
        return {
            inProgress: false,
            value: action.value,
        };
    case FEE_GRANT_ALLOWANCE_ERROR:
        return {
            ...state,
            inProgress: false,
        };
    default:
        return state;
    }
};

export default combineReducers({
    feeGrant,
});
