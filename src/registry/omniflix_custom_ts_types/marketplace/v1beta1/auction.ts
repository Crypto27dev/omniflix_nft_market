/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Timestamp} from "../../google/protobuf/timestamp";
import {Coin} from "../../cosmos/base/v1beta1/coin";
import {WeightedAddress} from "./listing";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

export enum AuctionStatus {
    AUCTION_STATUS_UNSPECIFIED = 0,
    AUCTION_STATUS_INACTIVE = 1,
    AUCTION_STATUS_ACTIVE = 2,
    UNRECOGNIZED = -1,
}

export function auctionStatusFromJSON(object: any): AuctionStatus {
    switch (object) {
        case 0:
        case "AUCTION_STATUS_UNSPECIFIED":
            return AuctionStatus.AUCTION_STATUS_UNSPECIFIED;
        case 1:
        case "AUCTION_STATUS_INACTIVE":
            return AuctionStatus.AUCTION_STATUS_INACTIVE;
        case 2:
        case "AUCTION_STATUS_ACTIVE":
            return AuctionStatus.AUCTION_STATUS_ACTIVE;
        case -1:
        case "UNRECOGNIZED":
        default:
            return AuctionStatus.UNRECOGNIZED;
    }
}

export function auctionStatusToJSON(object: AuctionStatus): string {
    switch (object) {
        case AuctionStatus.AUCTION_STATUS_UNSPECIFIED:
            return "AUCTION_STATUS_UNSPECIFIED";
        case AuctionStatus.AUCTION_STATUS_INACTIVE:
            return "AUCTION_STATUS_INACTIVE";
        case AuctionStatus.AUCTION_STATUS_ACTIVE:
            return "AUCTION_STATUS_ACTIVE";
        default:
            return "UNKNOWN";
    }
}

export interface AuctionListing {
    id: number;
    nftId: string;
    denomId: string;
    startPrice: Coin | undefined;
    startTime: Date | undefined;
    endTime: Date | undefined;
    owner: string;
    incrementPercentage: string;
    whitelistAccounts: string[];
    splitShares: WeightedAddress[];
}

export interface Bid {
    auctionId: number;
    bidder: string;
    amount: Coin | undefined;
    time: Date | undefined;
}

function createBaseAuctionListing(): AuctionListing {
    return {
        id: 0,
        nftId: "",
        denomId: "",
        startPrice: undefined,
        startTime: undefined,
        endTime: undefined,
        owner: "",
        incrementPercentage: "",
        whitelistAccounts: [],
        splitShares: [],
    };
}

export const AuctionListing = {
    encode(message: AuctionListing, writer: Writer = Writer.create()): Writer {
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.startPrice !== undefined) {
            Coin.encode(message.startPrice, writer.uint32(34).fork()).ldelim();
        }
        if (message.startTime !== undefined) {
            Timestamp.encode(
                toTimestamp(message.startTime),
                writer.uint32(42).fork()
            ).ldelim();
        }
        if (message.endTime !== undefined) {
            Timestamp.encode(
                toTimestamp(message.endTime),
                writer.uint32(50).fork()
            ).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(58).string(message.owner);
        }
        if (message.incrementPercentage !== "") {
            writer.uint32(66).string(message.incrementPercentage);
        }
        for (const v of message.whitelistAccounts) {
            writer.uint32(74).string(v!);
        }
        for (const v of message.splitShares) {
            WeightedAddress.encode(v!, writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): AuctionListing {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAuctionListing();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64() as Long);
                    break;
                case 2:
                    message.nftId = reader.string();
                    break;
                case 3:
                    message.denomId = reader.string();
                    break;
                case 4:
                    message.startPrice = Coin.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.startTime = fromTimestamp(
                        Timestamp.decode(reader, reader.uint32())
                    );
                    break;
                case 6:
                    message.endTime = fromTimestamp(
                        Timestamp.decode(reader, reader.uint32())
                    );
                    break;
                case 7:
                    message.owner = reader.string();
                    break;
                case 8:
                    message.incrementPercentage = reader.string();
                    break;
                case 9:
                    message.whitelistAccounts.push(reader.string());
                    break;
                case 10:
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

    fromJSON(object: any): AuctionListing {
        return {
            id: isSet(object.id) ? Number(object.id) : 0,
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            startPrice: isSet(object.startPrice)
                ? Coin.fromJSON(object.startPrice)
                : undefined,
            startTime: isSet(object.startTime)
                ? fromJsonTimestamp(object.startTime)
                : undefined,
            endTime: isSet(object.endTime)
                ? fromJsonTimestamp(object.endTime)
                : undefined,
            owner: isSet(object.owner) ? String(object.owner) : "",
            incrementPercentage: isSet(object.incrementPercentage)
                ? String(object.incrementPercentage)
                : "",
            whitelistAccounts: Array.isArray(object?.whitelistAccounts)
                ? object.whitelistAccounts.map((e: any) => String(e))
                : [],
            splitShares: Array.isArray(object?.splitShares)
                ? object.splitShares.map((e: any) => WeightedAddress.fromJSON(e))
                : [],
        };
    },

    toJSON(message: AuctionListing): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = Math.round(message.id));
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.startPrice !== undefined &&
        (obj.startPrice = message.startPrice
            ? Coin.toJSON(message.startPrice)
            : undefined);
        message.startTime !== undefined &&
        (obj.startTime = message.startTime.toISOString());
        message.endTime !== undefined &&
        (obj.endTime = message.endTime.toISOString());
        message.owner !== undefined && (obj.owner = message.owner);
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
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<AuctionListing>, I>>(
        object: I
    ): AuctionListing {
        const message = createBaseAuctionListing();
        message.id = object.id ?? 0;
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.startPrice =
            object.startPrice !== undefined && object.startPrice !== null
                ? Coin.fromPartial(object.startPrice)
                : undefined;
        message.startTime = object.startTime ?? undefined;
        message.endTime = object.endTime ?? undefined;
        message.owner = object.owner ?? "";
        message.incrementPercentage = object.incrementPercentage ?? "";
        message.whitelistAccounts = object.whitelistAccounts?.map((e) => e) || [];
        message.splitShares =
            object.splitShares?.map((e) => WeightedAddress.fromPartial(e)) || [];
        return message;
    },
};

function createBaseBid(): Bid {
    return {auctionId: 0, bidder: "", amount: undefined, time: undefined};
}

export const Bid = {
    encode(message: Bid, writer: Writer = Writer.create()): Writer {
        if (message.auctionId !== 0) {
            writer.uint32(8).uint64(message.auctionId);
        }
        if (message.bidder !== "") {
            writer.uint32(18).string(message.bidder);
        }
        if (message.amount !== undefined) {
            Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        if (message.time !== undefined) {
            Timestamp.encode(
                toTimestamp(message.time),
                writer.uint32(34).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Bid {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBid();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.auctionId = longToNumber(reader.uint64() as Long);
                    break;
                case 2:
                    message.bidder = reader.string();
                    break;
                case 3:
                    message.amount = Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.time = fromTimestamp(
                        Timestamp.decode(reader, reader.uint32())
                    );
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Bid {
        return {
            auctionId: isSet(object.auctionId) ? Number(object.auctionId) : 0,
            bidder: isSet(object.bidder) ? String(object.bidder) : "",
            amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
            time: isSet(object.time) ? fromJsonTimestamp(object.time) : undefined,
        };
    },

    toJSON(message: Bid): unknown {
        const obj: any = {};
        message.auctionId !== undefined &&
        (obj.auctionId = Math.round(message.auctionId));
        message.bidder !== undefined && (obj.bidder = message.bidder);
        message.amount !== undefined &&
        (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
        message.time !== undefined && (obj.time = message.time.toISOString());
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Bid>, I>>(object: I): Bid {
        const message = createBaseBid();
        message.auctionId = object.auctionId ?? 0;
        message.bidder = object.bidder ?? "";
        message.amount =
            object.amount !== undefined && object.amount !== null
                ? Coin.fromPartial(object.amount)
                : undefined;
        message.time = object.time ?? undefined;
        return message;
    },
};

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
