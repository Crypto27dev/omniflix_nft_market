import { ACTIVITY_URL, config } from '../config';

const URL = config.API_URL;
const REST_URL = config.REST_URL;
const DATA_LAYER = config.DATA_LAYER;

export const FEE_GRANT_ALLOWANCE_URL = `${URL}/me/fee-grant`;
export const STATS_URL = `${DATA_LAYER}/stats`;
export const urlFaucetValidation = (address) => `${DATA_LAYER}/claim-status/${address}`;
export const urlFetchAccount = (address) => `${REST_URL}/cosmos/auth/v1beta1/accounts/${address}`;
export const urlFetchIBCAccount = (REST_URL, address) => `${REST_URL}/cosmos/auth/v1beta1/accounts/${address}`;
export const urlFetchSimulate = (REST_URL) => `${REST_URL}/cosmos/tx/v1beta1/simulate`;

export const urlListings = (skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search) => {
    const params = ['statuses[]=LISTED', 'ipInfringement=false'];
    if (sortBy) {
        params.push(`sortBy=${sortBy}`);
    } else {
        params.push('sortBy=created_at');
    }
    if (order) {
        params.push(`order=${order}`);
    } else {
        params.push('order=desc');
    }

    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (priceDenom && priceDenom.length > 0) {
        priceDenom && priceDenom.length > 0 && priceDenom.map((val) => {
            return params.push('priceDenoms[]=' + val);
        });
    }
    if (minPrice) {
        params.push(`priceFrom=${minPrice}`);
    }
    if (maxPrice) {
        params.push(`priceTo=${maxPrice}`);
    }
    if (search) {
        params.push(`searchKey=${search}`);
    }

    return `${DATA_LAYER}/listings?${params.join('&')}`;
};

export const urlAuctionListings = (skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search) => {
    const params = ['ipInfringement=false'];
    if (sortBy) {
        params.push(`sortBy=${sortBy}`);
        if (sortBy === 'end_time' && order === 'asc') {
            params.push('statuses[]=CREATED');
        }
    } else {
        params.push('sortBy=created_at');
    }
    if (order) {
        params.push(`order=${order}`);
    } else {
        params.push('order=desc');
    }

    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (priceDenom && priceDenom.length > 0) {
        priceDenom && priceDenom.length > 0 && priceDenom.map((val) => {
            return params.push('priceDenoms[]=' + val);
        });
    }
    if (minPrice) {
        params.push(`priceFrom=${minPrice}`);
    }
    if (maxPrice) {
        params.push(`priceTo=${maxPrice}`);
    }
    if (search) {
        params.push(`searchKey=${search}`);
    }
    if (auctionType === 'myBids') {
        params.push(`participantAddress=${address}`);
    }
    if (auctionType === 'myAuctions') {
        params.push(`owner=${address}`);
    }

    return `${DATA_LAYER}/auctions?${params.join('&')}`;
};

export const urlCollectionAuction = (id, skip, limit, priceDenom, minPrice, maxPrice, auctionType, address, sortBy, order, search) => {
    const params = ['denomId=' + id, 'ipInfringement=false'];

    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (search) {
        params.push(`searchKey=${search}`);
    }
    if (sortBy) {
        params.push(`sortBy=${sortBy}`);
    } else {
        params.push('sortBy=created_at');
    }
    if (order) {
        params.push(`order=${order}`);
    } else {
        params.push('order=desc');
    }
    if (priceDenom && priceDenom.length > 0) {
        priceDenom && priceDenom.length > 0 && priceDenom.map((val) => {
            return params.push('priceDenoms[]=' + val);
        });
    }
    if (minPrice) {
        params.push(`priceFrom=${minPrice}`);
    }
    if (maxPrice) {
        params.push(`priceTo=${maxPrice}`);
    }
    if (auctionType === 'myBids') {
        params.push(`participantAddress=${address}`);
    }
    if (auctionType === 'myAuctions') {
        params.push(`owner=${address}`);
    }

    return `${DATA_LAYER}/auctions?${params.join('&')}`;
};

export const urlCollections = (address, skip, limit, searchKey) => {
    const params = ['sortBy=created_at', 'order=desc', 'withNFTs=true', 'ipInfringement=false'];
    if (address) {
        params.push(`owner=${address}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (searchKey) {
        params.push(`searchKey=${searchKey}`);
    }

    return `${DATA_LAYER}/collections?${params.join('&')}`;
};
export const urlLaunchpadCollections = (address, skip, limit, searchKey) => {
    const params = ['sortBy=created_at', 'order=desc', 'ipInfringement=false', 'onLaunchpad=true'];
    if (address) {
        params.push(`owner=${address}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (searchKey) {
        params.push(`searchKey=${searchKey}`);
    }

    return `${DATA_LAYER}/collections?${params.join('&')}`;
};
export const urlCollectionsTable = (address, skip, limit, searchKey, sortBy, order) => {
    const params = ['withNFTs=true', 'ipInfringement=false'];
    if (address) {
        params.push(`owner=${address}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (searchKey) {
        params.push(`searchKey=${searchKey}`);
    }

    if (sortBy && sortBy.length > 0) {
        params.push(`sortBy=${sortBy}`);

        if (order) {
            params.push(`order=${order}`);
        }
    }

    return `${DATA_LAYER}/collections?${params.join('&')}`;
};

export const urlCollection = (id) => {
    return `${DATA_LAYER}/collections/${id}`;
};

export const urlListedCollectionNfts = (id, skip, limit, priceDenom, minPrice, maxPrice, sortBy, order, search) => {
    const params = ['denomId=' + id, 'ipInfringement=false'];

    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (search) {
        params.push(`searchKey=${search}`);
    }
    if (sortBy) {
        params.push(`sortBy=${sortBy}`);
    } else {
        params.push('sortBy=created_at');
    }
    if (order) {
        params.push(`order=${order}`);
    } else {
        params.push('order=desc');
    }
    if (priceDenom && priceDenom.length > 0) {
        priceDenom && priceDenom.length > 0 && priceDenom.map((val) => {
            return params.push('priceDenoms[]=' + val);
        });
    }
    if (minPrice) {
        params.push(`priceFrom=${minPrice}`);
    }
    if (maxPrice) {
        params.push(`priceTo=${maxPrice}`);
    }

    return `${DATA_LAYER}/listings?${params.join('&')}`;
};

export const urlNonListedCollectionNfts = (id, skip, limit, search) => {
    const params = ['denomId=' + id, 'listed=false', 'sortBy=created_at', 'ipInfringement=false'];
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (search) {
        params.push(`searchKey=${search}`);
    }

    return `${DATA_LAYER}/nfts?${params.join('&')}`;
};

export const urlCollectionMyNfts = (id, owner, skip, limit) => {
    const params = ['denomId=' + id, 'owner=' + owner, 'sortBy=updated_at', 'order=desc', 'ipInfringement=false'];
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }

    return `${DATA_LAYER}/nfts?${params.join('&')}`;
};

export const urlNFT = (nftID) => `${DATA_LAYER}/nfts/${nftID}`;
export const urlNFTActivity = (nftID, skip, limit) => {
    const params = ['sortBy=created_at', 'order=desc'];
    if (nftID) {
        params.push(`nftId=${nftID}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }

    return `${ACTIVITY_URL}/activity?${params.join('&')}`;
};
export const urlAuctionBidHistory = (auctionId, skip, limit) => {
    const params = ['statuses[]=PLACED', 'statuses[]=ACCEPTED', 'statuses[]=CLOSED'];
    if (auctionId) {
        params.push(`auctionId=${auctionId}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }

    return `${DATA_LAYER}/bids?${params.join('&')}`;
};

export const urlUserCollections = (creator, skip, limit) => {
    const params = ['sortBy=updated_at', 'order=desc', 'ipInfringement=false'];
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }

    return `${DATA_LAYER}/collections?creator=${creator}&${params.join('&')}`;
};

export const urlOwnerCollections = (creator) => `${DATA_LAYER}/collections?creator=${creator}&sortBy=updated_at&limit=6`;

export const urlUserNFTs = (owner, skip, limit) => {
    const params = ['sortBy=updated_at', 'order=desc', 'ipInfringement=false'];
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }

    return `${DATA_LAYER}/nfts?owner=${owner}&${params.join('&')}`;
};
export const urlOwnerNFTs = (owner) => `${DATA_LAYER}/nfts?owner=${owner}&sortBy=updated_at&limit=6`;

// User Activity
export const urlUserActivity = (address, skip, limit, sortBy, order) => {
    const params = [];
    if (address) {
        params.push(`address=${address}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (sortBy && sortBy.length > 0) {
        params.push(`sortBy=${sortBy}`);

        if (order) {
            params.push(`order=${order}`);
        }
    }
    return `${ACTIVITY_URL}/activity?${params.join('&')}`;
};
export const urlCollectionActivity = (id, skip, limit, sortBy, order) => {
    const params = [];
    if (id) {
        params.push(`denomId=${id}`);
    }
    if (skip) {
        params.push(`skip=${skip}`);
    }
    if (limit) {
        params.push(`limit=${limit}`);
    }
    if (sortBy && sortBy.length > 0) {
        params.push(`sortBy=${sortBy}`);

        if (order) {
            params.push(`order=${order}`);
        }
    }

    return `${ACTIVITY_URL}/activity?${params.join('&')}`;
};

export const urlAccountTokensTraded = (id) => `${DATA_LAYER}/trade-info?address=${id}`;

export const IBC_TOKENS_LIST_URL = `${DATA_LAYER}/tokens`;
export const CONNECT_ACCOUNT_URL = `${URL}/users/connect-bc-account`;

export const urlVerifyAccount = (userId) =>
    `${URL}/users/${userId}/verify-bc-account`;

export const urlMarketplaceListing = (skip, limit) => {
    const params = ['pagination.countTotal=true'];
    if (skip) {
        params.push(`pagination.offset=${skip}`);
    }
    if (limit) {
        params.push(`pagination.limit=${limit}`);
    }

    return `${REST_URL}/omniflix/marketplace/v1beta1/listings?${params.join('&')}`;
};

export const urlBuyNFT = (id) => `${REST_URL}/marketplace/listings/${id}/buy-nft`;
