import { ACTIVE_CARD_HIDE, ACTIVE_CARD_SET } from '../constants/explore';

export const showActiveCard = (value) => {
    return {
        type: ACTIVE_CARD_SET,
        value,
    };
};

export const hideActiveCard = () => {
    return {
        type: ACTIVE_CARD_HIDE,
    };
};
