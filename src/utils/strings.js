export const getAssetType = (value) => {
    if (!value) {
        return null;
    }
    switch (value) {
    case 'application/x-shockwave-flash':
        return 'video';
    case 'application/doc':
    case 'application/ms-doc':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/pdf':
    case 'application/epub+zip':
    case 'application/vnd.oasis.opendocument.presentation':
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/rtf':
    case 'application/vnd.ms-excel':
    case 'application/xml':
        return 'document';
    default:
        break;
    }

    const array = value.split('/');

    return array[0];
};

export const getAssetTypeExtension = (value) => {
    if (!value) {
        return null;
    }

    const array = value.split('/');

    if (array && array.length && array[1]) {
        return array[1];
    }

    return null;
};

export const removeUnderScrolls = (value) => {
    return value && value.split('_').join(' ');
};

export const convertToCamelCase = (value) => {
    const object = {};
    if (Object.keys(value).length) {
        Object.keys(value).map((val) => {
            let string = val && val.split('_');
            if (string.length > 1) {
                string.map((str, index) => {
                    if (index > 0) {
                        string[index] = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
                    }

                    return null;
                });

                string = string.join('');
            }

            let object2 = value[val];
            if (object2 && typeof (object2) === 'object' && !Array.isArray(object2)) {
                object2 = convertToCamelCase(object2);
            }
            object[string] = object2;

            return null;
        });

        return object;
    }
};

export const MsgTypes = (value, address) => {
    switch (value.type) {
    case 'MsgListNFT':
        return 'Listed NFT';
    case 'MsgMintONFT':
        return 'Mint NFT';
    case 'MsgBuyNFT':
        return 'Buy NFT';
    case 'MsgDeListNFT':
        return 'Delist NFT';
    case 'MsgBurnONFT':
        return 'Burn NFT';
    case 'MsgCreateDenom':
        return 'Collection created';
    case 'MsgTransferONFT':
        return 'Transferred NFT';
    case 'MsgSend':
        if (value.recipient && value.recipient === address) {
            return 'Received';
        } else {
            return 'Sent';
        }
    case 'MsgSubmitProposal':
        return 'Submit proposal';
    case 'MsgVote':
        return 'Vote';
    case 'MsgDelegate':
        return 'Delegate';
    case 'MsgCreateAuction':
        return 'Auction created';
    case 'MsgPlaceBid':
        return 'Bid placed';
    case 'ProcessBid':
        return 'Bid processed';
    case 'RemoveAuction':
        return 'Auction removed';
    default:
        return value.type;
    }
};
