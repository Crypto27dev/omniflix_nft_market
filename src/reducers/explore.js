import { combineReducers } from 'redux';
import { ACTIVE_CARD_HIDE, ACTIVE_CARD_SET } from '../constants/explore';
import { FILTERS_SHOW } from '../constants/filters';

const activeCard = (state = {
    open: false,
    value: {},
    activeNFTID: '',
}, action) => {
    switch (action.type) {
    case ACTIVE_CARD_SET:
        return {
            open: true,
            value: action.value,
            activeNFTID: action.value && action.value.nftDetails && action.value.nftDetails.id,
        };
    case ACTIVE_CARD_HIDE:
    case FILTERS_SHOW:
        return {
            open: false,
            value: {},
            activeNFTID: '',
        };
    default:
        return state;
    }
};

export default combineReducers({
    activeCard,
});
