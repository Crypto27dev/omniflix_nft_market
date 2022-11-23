import {
    MsgBuyNFT,
    MsgCancelAuction,
    MsgCreateAuction,
    MsgDeListNFT,
    MsgEditListing,
    MsgListNFT,
    MsgPlaceBid,
} from './omniflix_custom_ts_types/marketplace/v1beta1/tx';
import {
    MsgBurnONFT,
    MsgCreateDenom,
    MsgMintONFT,
    MsgTransferDenom,
    MsgTransferONFT,
    MsgUpdateDenom,
} from './omniflix_custom_ts_types/onft/v1beta1/tx';

export const customTypes = {
    CreateDenom: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgCreateDenom',
        type: MsgCreateDenom,
    },
    UpdateDenom: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgUpdateDenom',
        type: MsgUpdateDenom,
    },
    TransferDenom: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgTransferDenom',
        type: MsgTransferDenom,
    },
    MintONFT: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgMintONFT',
        type: MsgMintONFT,
    },
    TransferONFT: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgTransferONFT',
        type: MsgTransferONFT,
    },
    BurnONFT: {
        typeUrl: '/OmniFlix.onft.v1beta1.MsgBurnONFT',
        type: MsgBurnONFT,
    },
    ListNFT: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgListNFT',
        type: MsgListNFT,
    },
    EditListing: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgEditListing',
        type: MsgEditListing,
    },
    DeListNFT: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgDeListNFT',
        type: MsgDeListNFT,
    },
    BuyNFT: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgBuyNFT',
        type: MsgBuyNFT,
    },
    CreateAuction: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgCreateAuction',
        type: MsgCreateAuction,
    },
    CancelAuction: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgCancelAuction',
        type: MsgCancelAuction,
    },
    PlaceBid: {
        typeUrl: '/OmniFlix.marketplace.v1beta1.MsgPlaceBid',
        type: MsgPlaceBid,
    },
};

export const customRegistry = [[
    customTypes.CreateDenom.typeUrl,
    customTypes.CreateDenom.type,
], [
    customTypes.UpdateDenom.typeUrl,
    customTypes.UpdateDenom.type,
], [
    customTypes.TransferDenom.typeUrl,
    customTypes.TransferDenom.type,
], [
    customTypes.MintONFT.typeUrl,
    customTypes.MintONFT.type,
], [
    customTypes.TransferONFT.typeUrl,
    customTypes.TransferONFT.type,
], [
    customTypes.BurnONFT.typeUrl,
    customTypes.BurnONFT.type,
], [
    customTypes.ListNFT.typeUrl,
    customTypes.ListNFT.type,
], [
    customTypes.EditListing.typeUrl,
    customTypes.EditListing.type,
], [
    customTypes.DeListNFT.typeUrl,
    customTypes.DeListNFT.type,
], [
    customTypes.BuyNFT.typeUrl,
    customTypes.BuyNFT.type,
], [
    customTypes.CreateAuction.typeUrl,
    customTypes.CreateAuction.type,
], [
    customTypes.CancelAuction.typeUrl,
    customTypes.CancelAuction.type,
], [
    customTypes.PlaceBid.typeUrl,
    customTypes.PlaceBid.type,
]];
