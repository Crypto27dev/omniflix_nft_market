/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Coin} from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

export interface Listing {
    id: string;
    nftId: string;
    denomId: string;
    price: Coin | undefined;
    owner: string;
    splitShares: WeightedAddress[];
}

export interface WeightedAddress {
    address: string;
    weight: string;
}

function createBaseListing(): Listing {
    return {
        id: "",
        nftId: "",
        denomId: "",
        price: undefined,
        owner: "",
        splitShares: [],
    };
}

export const Listing = {
    encode(message: Listing, writer: Writer = Writer.create()): Writer {
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

    decode(input: Reader | Uint8Array, length?: number): Listing {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListing();
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

    fromJSON(object: any): Listing {
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

    toJSON(message: Listing): unknown {
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

    fromPartial<I extends Exact<DeepPartial<Listing>, I>>(object: I): Listing {
        const message = createBaseListing();
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

function createBaseWeightedAddress(): WeightedAddress {
    return {address: "", weight: ""};
}

export const WeightedAddress = {
    encode(message: WeightedAddress, writer: Writer = Writer.create()): Writer {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.weight !== "") {
            writer.uint32(18).string(message.weight);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): WeightedAddress {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWeightedAddress();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.weight = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): WeightedAddress {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            weight: isSet(object.weight) ? String(object.weight) : "",
        };
    },

    toJSON(message: WeightedAddress): unknown {
        const obj: any = {};
        message.address !== undefined && (obj.address = message.address);
        message.weight !== undefined && (obj.weight = message.weight);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<WeightedAddress>, I>>(
        object: I
    ): WeightedAddress {
        const message = createBaseWeightedAddress();
        message.address = object.address ?? "";
        message.weight = object.weight ?? "";
        return message;
    },
};

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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any;
    configure();
}

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}
