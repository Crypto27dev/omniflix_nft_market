import { config } from '../config';

const URL = config.REST_URL;

export const urlFetchBalance = (address) => `${URL}/bank/balances/${address}`;
export const urlFetchAllowances = (address) => `${URL}/cosmos/feegrant/v1beta1/allowances/${address}`;
export const urlFetchIBCBalance = (url, address) => `${url}/bank/balances/${address}`;
export const urlTransferNFT = (denomID, onftId) => `${URL}/onft/onfts/${denomID}/${onftId}/transfer`;
export const urlDeList = (ID) =>
    `${URL}/marketplace/listings/${ID}/de-list-nft`;

export const urlFetchTimeoutHeight = (url, channel) => {
    let version = 'v1';
    if (url.indexOf('bluenet') > -1) {
        version = 'v1beta1';
    }

    return `${url}/ibc/core/channel/${version}/channels/${channel}/ports/transfer`;
};
export const urlAddFaucet = (chain) => `${config.FAUCET_URL}/${chain}/claim`;

export const LIST_NFT_URL = `${URL}/marketplace/list-nft`;
