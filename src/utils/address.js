import { Bech32 } from '@cosmjs/encoding';

export const decodeFromBech32 = (key) => {
    try {
        Bech32.decode(key);
        return true;
    } catch (e) {
        return false;
    }
};
