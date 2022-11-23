/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Timestamp} from "../../google/protobuf/timestamp";
import {Coin} from "../../cosmos/base/v1beta1/coin";
import {WeightedAddress} from "./listing";
import {Duration} from "../../google/protobuf/duration";
import {AuctionListing} from "./auction";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

export interface MsgListNFT {
    id: string;
    nftId: string;
    denomId: string;
    price: Coin | undefined;
    owner: string;
    splitShares: WeightedAddress[];
}

export interface MsgListNFTResponse {
}

export interface MsgEditListing {
    id: string;
    price: Coin | undefined;
    owner: string;
}

export interface MsgEditListingResponse {
}

export interface MsgDeListNFT {
    id: string;
    owner: string;
}

export interface MsgDeListNFTResponse {
}

export interface MsgBuyNFT {
    id: string;
    price: Coin | undefined;
    buyer: string;
}

export interface MsgBuyNFTResponse {
}

export interface MsgCreateAuction {
    nftId: string;
    denomId: string;
    startTime: Date | undefined;
    startPrice: Coin | undefined;
    duration: Duration | undefined;
    incrementPercentage: string;
    whitelistAccounts: string[];
    splitShares: WeightedAddress[];
    owner: string;
}

export interface MsgCreateAuctionResponse {
    auction: AuctionListing | undefined;
}

export interface MsgCancelAuction {
    auctionId: number;
    owner: string;
}

export interface MsgCancelAuctionResponse {
}

export interface MsgPlaceBid {
    auctionId: number;
    amount: Coin | undefined;
    bidder: string;
}

export interface MsgPlaceBidResponse {
}

function createBaseMsgListNFT(): MsgListNFT {
    return {
        id: "",
        nftId: "",
        denomId: "",
        price: undefined,
        owner: "",
        splitShares: [],
    };
}

export const MsgListNFT = {
    encode(message: MsgListNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.price !== undefined) {
            Coin.encode(message.price, writer.uint32(34).fork()).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(42).string(message.owner);
        }
        for (const v of message.splitShares) {
            WeightedAddress.encode(v!, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgListNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgListNFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.nftId = reader.string();
                    break;
                case 3:
                    message.denomId = reader.string();
                    break;
                case 4:
                    message.price = Coin.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.owner = reader.string();
                    break;
                case 6:
                    message.splitShares.push(
                        WeightedAddress.decode(reader, reader.uint32())
                    );
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgListNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            price: isSet(object.price) ? Coin.fromJSON(object.price) : undefined,
            owner: isSet(object.owner) ? String(object.owner) : "",
            splitShares: Array.isArray(object?.splitShares)
                ? object.splitShares.map((e: any) => WeightedAddress.fromJSON(e))
                : [],
        };
    },

    toJSON(message: MsgListNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.price !== undefined &&
        (obj.price = message.price ? Coin.toJSON(message.price) : undefined);
        message.owner !== undefined && (obj.owner = message.owner);
        if (message.splitShares) {
            obj.splitShares = message.splitShares.map((e) =>
                e ? WeightedAddress.toJSON(e) : undefined
            );
        } else {
            obj.splitShares = [];
        }
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgListNFT>, I>>(
        object: I
    ): MsgListNFT {
        const message = createBaseMsgListNFT();
        message.id = object.id ?? "";
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.price =
            object.price !== undefined && object.price !== null
                ? Coin.fromPartial(object.price)
                : undefined;
        message.owner = object.owner ?? "";
        message.splitShares =
            object.splitShares?.map((e) => WeightedAddress.fromPartial(e)) || [];
        return message;
    },
};

function createBaseMsgListNFTResponse(): MsgListNFTResponse {
    return {};
}

export const MsgListNFTResponse = {
    encode(_: MsgListNFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgListNFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgListNFTResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgListNFTResponse {
        return {};
    },

    toJSON(_: MsgListNFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgListNFTResponse>, I>>(
        _: I
    ): MsgListNFTResponse {
        const message = createBaseMsgListNFTResponse();
        return message;
    },
};

function createBaseMsgEditListing(): MsgEditListing {
    return {id: "", price: undefined, owner: ""};
}

export const MsgEditListing = {
    encode(message: MsgEditListing, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.price !== undefined) {
            Coin.encode(message.price, writer.uint32(18).fork()).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(26).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgEditListing {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEditListing();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.price = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgEditListing {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            price: isSet(object.price) ? Coin.fromJSON(object.price) : undefined,
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: MsgEditListing): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.price !== undefined &&
        (obj.price = message.price ? Coin.toJSON(message.price) : undefined);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgEditListing>, I>>(
        object: I
    ): MsgEditListing {
        const message = createBaseMsgEditListing();
        message.id = object.id ?? "";
        message.price =
            object.price !== undefined && object.price !== null
                ? Coin.fromPartial(object.price)
                : undefined;
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseMsgEditListingResponse(): MsgEditListingResponse {
    return {};
}

export const MsgEditListingResponse = {
    encode(_: MsgEditListingResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgEditListingResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEditListingResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgEditListingResponse {
        return {};
    },

    toJSON(_: MsgEditListingResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgEditListingResponse>, I>>(
        _: I
    ): MsgEditListingResponse {
        const message = createBaseMsgEditListingResponse();
        return message;
    },
};

function createBaseMsgDeListNFT(): MsgDeListNFT {
    return {id: "", owner: ""};
}

export const MsgDeListNFT = {
    encode(message: MsgDeListNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgDeListNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDeListNFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgDeListNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: MsgDeListNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgDeListNFT>, I>>(
        object: I
    ): MsgDeListNFT {
        const message = createBaseMsgDeListNFT();
        message.id = object.id ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseMsgDeListNFTResponse(): MsgDeListNFTResponse {
    return {};
}

export const MsgDeListNFTResponse = {
    encode(_: MsgDeListNFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgDeListNFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDeListNFTResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgDeListNFTResponse {
        return {};
    },

    toJSON(_: MsgDeListNFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgDeListNFTResponse>, I>>(
        _: I
    ): MsgDeListNFTResponse {
        const message = createBaseMsgDeListNFTResponse();
        return message;
    },
};

function createBaseMsgBuyNFT(): MsgBuyNFT {
    return {id: "", price: undefined, buyer: ""};
}

export const MsgBuyNFT = {
    encode(message: MsgBuyNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.price !== undefined) {
            Coin.encode(message.price, writer.uint32(18).fork()).ldelim();
        }
        if (message.buyer !== "") {
            writer.uint32(26).string(message.buyer);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgBuyNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBuyNFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.price = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.buyer = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgBuyNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            price: isSet(object.price) ? Coin.fromJSON(object.price) : undefined,
            buyer: isSet(object.buyer) ? String(object.buyer) : "",
        };
    },

    toJSON(message: MsgBuyNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.price !== undefined &&
        (obj.price = message.price ? Coin.toJSON(message.price) : undefined);
        message.buyer !== undefined && (obj.buyer = message.buyer);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgBuyNFT>, I>>(
        object: I
    ): MsgBuyNFT {
        const message = createBaseMsgBuyNFT();
        message.id = object.id ?? "";
        message.price =
            object.price !== undefined && object.price !== null
                ? Coin.fromPartial(object.price)
                : undefined;
        message.buyer = object.buyer ?? "";
        return message;
    },
};

function createBaseMsgBuyNFTResponse(): MsgBuyNFTResponse {
    return {};
}

export const MsgBuyNFTResponse = {
    encode(_: MsgBuyNFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgBuyNFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBuyNFTResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgBuyNFTResponse {
        return {};
    },

    toJSON(_: MsgBuyNFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgBuyNFTResponse>, I>>(
        _: I
    ): MsgBuyNFTResponse {
        const message = createBaseMsgBuyNFTResponse();
        return message;
    },
};

function createBaseMsgCreateAuction(): MsgCreateAuction {
    return {
        nftId: "",
        denomId: "",
        startTime: undefined,
        startPrice: undefined,
        duration: undefined,
        incrementPercentage: "",
        whitelistAccounts: [],
        splitShares: [],
        owner: "",
    };
}

export const MsgCreateAuction = {
    encode(message: MsgCreateAuction, writer: Writer = Writer.create()): Writer {
        if (message.nftId !== "") {
            writer.uint32(10).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(18).string(message.denomId);
        }
        if (message.startTime !== undefined) {
            Timestamp.encode(
                toTimestamp(message.startTime),
                writer.uint32(26).fork()
            ).ldelim();
        }
        if (message.startPrice !== undefined) {
            Coin.encode(message.startPrice, writer.uint32(34).fork()).ldelim();
        }
        if (message.duration !== undefined) {
            Duration.encode(message.duration, writer.uint32(42).fork()).ldelim();
        }
        if (message.incrementPercentage !== "") {
            writer.uint32(50).string(message.incrementPercentage);
        }
        for (const v of message.whitelistAccounts) {
            writer.uint32(58).string(v!);
        }
        for (const v of message.splitShares) {
            WeightedAddress.encode(v!, writer.uint32(66).fork()).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(74).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgCreateAuction {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateAuction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nftId = reader.string();
                    break;
                case 2:
                    message.denomId = reader.string();
                    break;
                case 3:
                    message.startTime = fromTimestamp(
                        Timestamp.decode(reader, reader.uint32())
                    );
                    break;
                case 4:
                    message.startPrice = Coin.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.duration = Duration.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.incrementPercentage = reader.string();
                    break;
                case 7:
                    message.whitelistAccounts.push(reader.string());
                    break;
                case 8:
                    message.splitShares.push(
                        WeightedAddress.decode(reader, reader.uint32())
                    );
                    break;
                case 9:
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgCreateAuction {
        return {
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            startTime: isSet(object.startTime)
                ? fromJsonTimestamp(object.startTime)
                : undefined,
            startPrice: isSet(object.startPrice)
                ? Coin.fromJSON(object.startPrice)
                : undefined,
            duration: isSet(object.duration)
                ? Duration.fromJSON(object.duration)
                : undefined,
            incrementPercentage: isSet(object.incrementPercentage)
                ? String(object.incrementPercentage)
                : "",
            whitelistAccounts: Array.isArray(object?.whitelistAccounts)
                ? object.whitelistAccounts.map((e: any) => String(e))
                : [],
            splitShares: Array.isArray(object?.splitShares)
                ? object.splitShares.map((e: any) => WeightedAddress.fromJSON(e))
                : [],
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: MsgCreateAuction): unknown {
        const obj: any = {};
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.startTime !== undefined &&
        (obj.startTime = message.startTime.toISOString());
        message.startPrice !== undefined &&
        (obj.startPrice = message.startPrice
            ? Coin.toJSON(message.startPrice)
            : undefined);
        message.duration !== undefined &&
        (obj.duration = message.duration
            ? Duration.toJSON(message.duration)
            : undefined);
        message.incrementPercentage !== undefined &&
        (obj.incrementPercentage = message.incrementPercentage);
        if (message.whitelistAccounts) {
            obj.whitelistAccounts = message.whitelistAccounts.map((e) => e);
        } else {
            obj.whitelistAccounts = [];
        }
        if (message.splitShares) {
            obj.splitShares = message.splitShares.map((e) =>
                e ? WeightedAddress.toJSON(e) : undefined
            );
        } else {
            obj.splitShares = [];
        }
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCreateAuction>, I>>(
        object: I
    ): MsgCreateAuction {
        const message = createBaseMsgCreateAuction();
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.startTime = object.startTime ?? undefined;
        message.startPrice =
            object.startPrice !== undefined && object.startPrice !== null
                ? Coin.fromPartial(object.startPrice)
                : undefined;
        message.duration =
            object.duration !== undefined && object.duration !== null
                ? Duration.fromPartial(object.duration)
                : undefined;
        message.incrementPercentage = object.incrementPercentage ?? "";
        message.whitelistAccounts = object.whitelistAccounts?.map((e) => e) || [];
        message.splitShares =
            object.splitShares?.map((e) => WeightedAddress.fromPartial(e)) || [];
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseMsgCreateAuctionResponse(): MsgCreateAuctionResponse {
    return {auction: undefined};
}

export const MsgCreateAuctionResponse = {
    encode(
        message: MsgCreateAuctionResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.auction !== undefined) {
            AuctionListing.encode(message.auction, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): MsgCreateAuctionResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateAuctionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.auction = AuctionListing.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgCreateAuctionResponse {
        return {
            auction: isSet(object.auction)
                ? AuctionListing.fromJSON(object.auction)
                : undefined,
        };
    },

    toJSON(message: MsgCreateAuctionResponse): unknown {
        const obj: any = {};
        message.auction !== undefined &&
        (obj.auction = message.auction
            ? AuctionListing.toJSON(message.auction)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCreateAuctionResponse>, I>>(
        object: I
    ): MsgCreateAuctionResponse {
        const message = createBaseMsgCreateAuctionResponse();
        message.auction =
            object.auction !== undefined && object.auction !== null
                ? AuctionListing.fromPartial(object.auction)
                : undefined;
        return message;
    },
};

function createBaseMsgCancelAuction(): MsgCancelAuction {
    return {auctionId: 0, owner: ""};
}

export const MsgCancelAuction = {
    encode(message: MsgCancelAuction, writer: Writer = Writer.create()): Writer {
        if (message.auctionId !== 0) {
            writer.uint32(8).uint64(message.auctionId);
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgCancelAuction {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCancelAuction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.auctionId = longToNumber(reader.uint64() as Long);
                    break;
                case 2:
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgCancelAuction {
        return {
            auctionId: isSet(object.auctionId) ? Number(object.auctionId) : 0,
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: MsgCancelAuction): unknown {
        const obj: any = {};
        message.auctionId !== undefined &&
        (obj.auctionId = Math.round(message.auctionId));
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCancelAuction>, I>>(
        object: I
    ): MsgCancelAuction {
        const message = createBaseMsgCancelAuction();
        message.auctionId = object.auctionId ?? 0;
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseMsgCancelAuctionResponse(): MsgCancelAuctionResponse {
    return {};
}

export const MsgCancelAuctionResponse = {
    encode(
        _: MsgCancelAuctionResponse,
        writer: Writer = Writer.create()
    ): Writer {
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): MsgCancelAuctionResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCancelAuctionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgCancelAuctionResponse {
        return {};
    },

    toJSON(_: MsgCancelAuctionResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCancelAuctionResponse>, I>>(
        _: I
    ): MsgCancelAuctionResponse {
        const message = createBaseMsgCancelAuctionResponse();
        return message;
    },
};

function createBaseMsgPlaceBid(): MsgPlaceBid {
    return {auctionId: 0, amount: undefined, bidder: ""};
}

export const MsgPlaceBid = {
    encode(message: MsgPlaceBid, writer: Writer = Writer.create()): Writer {
        if (message.auctionId !== 0) {
            writer.uint32(8).uint64(message.auctionId);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
        }
        if (message.bidder !== "") {
            writer.uint32(26).string(message.bidder);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgPlaceBid {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgPlaceBid();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.auctionId = longToNumber(reader.uint64() as Long);
                    break;
                case 2:
                    message.amount = Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.bidder = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgPlaceBid {
        return {
            auctionId: isSet(object.auctionId) ? Number(object.auctionId) : 0,
            amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
            bidder: isSet(object.bidder) ? String(object.bidder) : "",
        };
    },

    toJSON(message: MsgPlaceBid): unknown {
        const obj: any = {};
        message.auctionId !== undefined &&
        (obj.auctionId = Math.round(message.auctionId));
        message.amount !== undefined &&
        (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
        message.bidder !== undefined && (obj.bidder = message.bidder);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgPlaceBid>, I>>(
        object: I
    ): MsgPlaceBid {
        const message = createBaseMsgPlaceBid();
        message.auctionId = object.auctionId ?? 0;
        message.amount =
            object.amount !== undefined && object.amount !== null
                ? Coin.fromPartial(object.amount)
                : undefined;
        message.bidder = object.bidder ?? "";
        return message;
    },
};

function createBaseMsgPlaceBidResponse(): MsgPlaceBidResponse {
    return {};
}

export const MsgPlaceBidResponse = {
    encode(_: MsgPlaceBidResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgPlaceBidResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgPlaceBidResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(_: any): MsgPlaceBidResponse {
        return {};
    },

    toJSON(_: MsgPlaceBidResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgPlaceBidResponse>, I>>(
        _: I
    ): MsgPlaceBidResponse {
        const message = createBaseMsgPlaceBidResponse();
        return message;
    },
};

export interface Msg {
    ListNFT(request: MsgListNFT): Promise<MsgListNFTResponse>;

    EditListing(request: MsgEditListing): Promise<MsgEditListingResponse>;

    DeListNFT(request: MsgDeListNFT): Promise<MsgDeListNFTResponse>;

    BuyNFT(request: MsgBuyNFT): Promise<MsgBuyNFTResponse>;

    CreateAuction(request: MsgCreateAuction): Promise<MsgCreateAuctionResponse>;

    CancelAuction(request: MsgCancelAuction): Promise<MsgCancelAuctionResponse>;

    PlaceBid(request: MsgPlaceBid): Promise<MsgPlaceBidResponse>;
}

export class MsgClientImpl implements Msg {
    private readonly rpc: Rpc;

    constructor(rpc: Rpc) {
        this.rpc = rpc;
        this.ListNFT = this.ListNFT.bind(this);
        this.EditListing = this.EditListing.bind(this);
        this.DeListNFT = this.DeListNFT.bind(this);
        this.BuyNFT = this.BuyNFT.bind(this);
        this.CreateAuction = this.CreateAuction.bind(this);
        this.CancelAuction = this.CancelAuction.bind(this);
        this.PlaceBid = this.PlaceBid.bind(this);
    }

    ListNFT(request: MsgListNFT): Promise<MsgListNFTResponse> {
        const data = MsgListNFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "ListNFT",
            data
        );
        return promise.then((data) => MsgListNFTResponse.decode(new Reader(data)));
    }

    EditListing(request: MsgEditListing): Promise<MsgEditListingResponse> {
        const data = MsgEditListing.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "EditListing",
            data
        );
        return promise.then((data) =>
            MsgEditListingResponse.decode(new Reader(data))
        );
    }

    DeListNFT(request: MsgDeListNFT): Promise<MsgDeListNFTResponse> {
        const data = MsgDeListNFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "DeListNFT",
            data
        );
        return promise.then((data) =>
            MsgDeListNFTResponse.decode(new Reader(data))
        );
    }

    BuyNFT(request: MsgBuyNFT): Promise<MsgBuyNFTResponse> {
        const data = MsgBuyNFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "BuyNFT",
            data
        );
        return promise.then((data) => MsgBuyNFTResponse.decode(new Reader(data)));
    }

    CreateAuction(request: MsgCreateAuction): Promise<MsgCreateAuctionResponse> {
        const data = MsgCreateAuction.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "CreateAuction",
            data
        );
        return promise.then((data) =>
            MsgCreateAuctionResponse.decode(new Reader(data))
        );
    }

    CancelAuction(request: MsgCancelAuction): Promise<MsgCancelAuctionResponse> {
        const data = MsgCancelAuction.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "CancelAuction",
            data
        );
        return promise.then((data) =>
            MsgCancelAuctionResponse.decode(new Reader(data))
        );
    }

    PlaceBid(request: MsgPlaceBid): Promise<MsgPlaceBidResponse> {
        const data = MsgPlaceBid.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Msg",
            "PlaceBid",
            data
        );
        return promise.then((data) => MsgPlaceBidResponse.decode(new Reader(data)));
    }
}

interface Rpc {
    request(
        service: string,
        method: string,
        data: Uint8Array
    ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    throw "Unable to locate global object";
})();

type Builtin =
    | Date
    | Function
    | Uint8Array
    | string
    | number
    | boolean
    | undefined;

export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T extends ReadonlyArray<infer U>
            ? ReadonlyArray<DeepPartial<U>>
            : T extends {}
                ? { [K in keyof T]?: DeepPartial<T[K]> }
                : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
    ? P
    : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>,
    never>;

function toTimestamp(date: Date): Timestamp {
    const newDate = new Date(date);
    const seconds = newDate.getTime() / 1_000;
    const nanos = (newDate.getTime() % 1_000) * 1_000_000;
    return {seconds, nanos};
}

function fromTimestamp(t: Timestamp): Date {
    let millis = t.seconds * 1_000;
    millis += t.nanos / 1_000_000;
    return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
    if (o instanceof Date) {
        return o;
    } else if (typeof o === "string") {
        return new Date(o);
    } else {
        return fromTimestamp(Timestamp.fromJSON(o));
    }
}

function longToNumber(long: Long): number {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any;
    configure();
}

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}
