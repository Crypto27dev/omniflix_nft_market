/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

/** EventListONFT is emitted on NFT Listing on market */
export interface EventListNFT {
    id: string;
    nftId: string;
    denomId: string;
    owner: string;
}

/** EventEditListing is emitted on edit Listing on market */
export interface EventEditListing {
    id: string;
    nftId: string;
    denomId: string;
    owner: string;
}

/** EventDeListONFT is emitted on NFT DeListing from market */
export interface EventDeListNFT {
    id: string;
    nftId: string;
    denomId: string;
    owner: string;
}

/** EventBuyONFT is emitted on NFT Buy */
export interface EventBuyNFT {
    id: string;
    nftId: string;
    denomId: string;
    owner: string;
    buyer: string;
}

function createBaseEventListNFT(): EventListNFT {
    return {id: "", nftId: "", denomId: "", owner: ""};
}

export const EventListNFT = {
    encode(message: EventListNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventListNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventListNFT();
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
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventListNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: EventListNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventListNFT>, I>>(
        object: I
    ): EventListNFT {
        const message = createBaseEventListNFT();
        message.id = object.id ?? "";
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseEventEditListing(): EventEditListing {
    return {id: "", nftId: "", denomId: "", owner: ""};
}

export const EventEditListing = {
    encode(message: EventEditListing, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventEditListing {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventEditListing();
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
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventEditListing {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: EventEditListing): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventEditListing>, I>>(
        object: I
    ): EventEditListing {
        const message = createBaseEventEditListing();
        message.id = object.id ?? "";
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseEventDeListNFT(): EventDeListNFT {
    return {id: "", nftId: "", denomId: "", owner: ""};
}

export const EventDeListNFT = {
    encode(message: EventDeListNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventDeListNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventDeListNFT();
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
                    message.owner = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventDeListNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: EventDeListNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventDeListNFT>, I>>(
        object: I
    ): EventDeListNFT {
        const message = createBaseEventDeListNFT();
        message.id = object.id ?? "";
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseEventBuyNFT(): EventBuyNFT {
    return {id: "", nftId: "", denomId: "", owner: "", buyer: ""};
}

export const EventBuyNFT = {
    encode(message: EventBuyNFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.nftId !== "") {
            writer.uint32(18).string(message.nftId);
        }
        if (message.denomId !== "") {
            writer.uint32(26).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        if (message.buyer !== "") {
            writer.uint32(42).string(message.buyer);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventBuyNFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBuyNFT();
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
                    message.owner = reader.string();
                    break;
                case 5:
                    message.buyer = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventBuyNFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
            buyer: isSet(object.buyer) ? String(object.buyer) : "",
        };
    },

    toJSON(message: EventBuyNFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.nftId !== undefined && (obj.nftId = message.nftId);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        message.buyer !== undefined && (obj.buyer = message.buyer);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventBuyNFT>, I>>(
        object: I
    ): EventBuyNFT {
        const message = createBaseEventBuyNFT();
        message.id = object.id ?? "";
        message.nftId = object.nftId ?? "";
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        message.buyer = object.buyer ?? "";
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
