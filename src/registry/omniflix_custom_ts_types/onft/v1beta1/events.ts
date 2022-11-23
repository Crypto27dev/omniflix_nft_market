/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";

export const protobufPackage = "OmniFlix.onft.v1beta1";

/** EventCreateDenom is emitted on Denom Creation */
export interface EventCreateDenom {
    id: string;
    symbol: string;
    name: string;
    creator: string;
}

/** EventUpdateDenom is emitted on Denom Update */
export interface EventUpdateDenom {
    id: string;
    symbol: string;
    name: string;
    creator: string;
}

/** EventTransferDenom is emitted on Denom Transfer */
export interface EventTransferDenom {
    id: string;
    symbol: string;
    sender: string;
    recipient: string;
}

/** EventMintONFT is emitted on Mint */
export interface EventMintONFT {
    denomId: string;
    id: string;
    uri: string;
    owner: string;
}

/** EventTransferONFT is emitted on Transfer */
export interface EventTransferONFT {
    denomId: string;
    id: string;
    sender: string;
    recipient: string;
}

/** EventBurnONFT is emitted on Burn */
export interface EventBurnONFT {
    denomId: string;
    id: string;
    owner: string;
}

function createBaseEventCreateDenom(): EventCreateDenom {
    return {id: "", symbol: "", name: "", creator: ""};
}

export const EventCreateDenom = {
    encode(message: EventCreateDenom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.creator !== "") {
            writer.uint32(34).string(message.creator);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventCreateDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventCreateDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.symbol = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.creator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventCreateDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            name: isSet(object.name) ? String(object.name) : "",
            creator: isSet(object.creator) ? String(object.creator) : "",
        };
    },

    toJSON(message: EventCreateDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.name !== undefined && (obj.name = message.name);
        message.creator !== undefined && (obj.creator = message.creator);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventCreateDenom>, I>>(
        object: I
    ): EventCreateDenom {
        const message = createBaseEventCreateDenom();
        message.id = object.id ?? "";
        message.symbol = object.symbol ?? "";
        message.name = object.name ?? "";
        message.creator = object.creator ?? "";
        return message;
    },
};

function createBaseEventUpdateDenom(): EventUpdateDenom {
    return {id: "", symbol: "", name: "", creator: ""};
}

export const EventUpdateDenom = {
    encode(message: EventUpdateDenom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.creator !== "") {
            writer.uint32(34).string(message.creator);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventUpdateDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventUpdateDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.symbol = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.creator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventUpdateDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            name: isSet(object.name) ? String(object.name) : "",
            creator: isSet(object.creator) ? String(object.creator) : "",
        };
    },

    toJSON(message: EventUpdateDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.name !== undefined && (obj.name = message.name);
        message.creator !== undefined && (obj.creator = message.creator);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventUpdateDenom>, I>>(
        object: I
    ): EventUpdateDenom {
        const message = createBaseEventUpdateDenom();
        message.id = object.id ?? "";
        message.symbol = object.symbol ?? "";
        message.name = object.name ?? "";
        message.creator = object.creator ?? "";
        return message;
    },
};

function createBaseEventTransferDenom(): EventTransferDenom {
    return {id: "", symbol: "", sender: "", recipient: ""};
}

export const EventTransferDenom = {
    encode(
        message: EventTransferDenom,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        if (message.recipient !== "") {
            writer.uint32(34).string(message.recipient);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventTransferDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventTransferDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.symbol = reader.string();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                case 4:
                    message.recipient = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventTransferDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
            recipient: isSet(object.recipient) ? String(object.recipient) : "",
        };
    },

    toJSON(message: EventTransferDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.sender !== undefined && (obj.sender = message.sender);
        message.recipient !== undefined && (obj.recipient = message.recipient);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventTransferDenom>, I>>(
        object: I
    ): EventTransferDenom {
        const message = createBaseEventTransferDenom();
        message.id = object.id ?? "";
        message.symbol = object.symbol ?? "";
        message.sender = object.sender ?? "";
        message.recipient = object.recipient ?? "";
        return message;
    },
};

function createBaseEventMintONFT(): EventMintONFT {
    return {denomId: "", id: "", uri: "", owner: ""};
}

export const EventMintONFT = {
    encode(message: EventMintONFT, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        if (message.uri !== "") {
            writer.uint32(26).string(message.uri);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventMintONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventMintONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                case 3:
                    message.uri = reader.string();
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

    fromJSON(object: any): EventMintONFT {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            id: isSet(object.id) ? String(object.id) : "",
            uri: isSet(object.uri) ? String(object.uri) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: EventMintONFT): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.id !== undefined && (obj.id = message.id);
        message.uri !== undefined && (obj.uri = message.uri);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventMintONFT>, I>>(
        object: I
    ): EventMintONFT {
        const message = createBaseEventMintONFT();
        message.denomId = object.denomId ?? "";
        message.id = object.id ?? "";
        message.uri = object.uri ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseEventTransferONFT(): EventTransferONFT {
    return {denomId: "", id: "", sender: "", recipient: ""};
}

export const EventTransferONFT = {
    encode(message: EventTransferONFT, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        if (message.recipient !== "") {
            writer.uint32(34).string(message.recipient);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventTransferONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventTransferONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                case 4:
                    message.recipient = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): EventTransferONFT {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            id: isSet(object.id) ? String(object.id) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
            recipient: isSet(object.recipient) ? String(object.recipient) : "",
        };
    },

    toJSON(message: EventTransferONFT): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.id !== undefined && (obj.id = message.id);
        message.sender !== undefined && (obj.sender = message.sender);
        message.recipient !== undefined && (obj.recipient = message.recipient);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventTransferONFT>, I>>(
        object: I
    ): EventTransferONFT {
        const message = createBaseEventTransferONFT();
        message.denomId = object.denomId ?? "";
        message.id = object.id ?? "";
        message.sender = object.sender ?? "";
        message.recipient = object.recipient ?? "";
        return message;
    },
};

function createBaseEventBurnONFT(): EventBurnONFT {
    return {denomId: "", id: "", owner: ""};
}

export const EventBurnONFT = {
    encode(message: EventBurnONFT, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        if (message.owner !== "") {
            writer.uint32(26).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): EventBurnONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventBurnONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
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

    fromJSON(object: any): EventBurnONFT {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            id: isSet(object.id) ? String(object.id) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: EventBurnONFT): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.id !== undefined && (obj.id = message.id);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<EventBurnONFT>, I>>(
        object: I
    ): EventBurnONFT {
        const message = createBaseEventBurnONFT();
        message.denomId = object.denomId ?? "";
        message.id = object.id ?? "";
        message.owner = object.owner ?? "";
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
