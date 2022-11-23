/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Metadata} from "../../onft/v1beta1/onft";

export const protobufPackage = "OmniFlix.onft.v1beta1";

export interface MsgCreateDenom {
    id: string;
    symbol: string;
    name: string;
    description: string;
    previewUri: string;
    schema: string;
    sender: string;
}

export interface MsgCreateDenomResponse {
}

export interface MsgUpdateDenom {
    id: string;
    name: string;
    description: string;
    previewUri: string;
    sender: string;
}

export interface MsgUpdateDenomResponse {
}

export interface MsgTransferDenom {
    id: string;
    sender: string;
    recipient: string;
}

export interface MsgTransferDenomResponse {
}

export interface MsgMintONFT {
    id: string;
    denomId: string;
    metadata: Metadata | undefined;
    data: string;
    transferable: boolean;
    extensible: boolean;
    nsfw: boolean;
    royaltyShare: string;
    sender: string;
    recipient: string;
}

export interface MsgMintONFTResponse {
}

export interface MsgTransferONFT {
    id: string;
    denomId: string;
    sender: string;
    recipient: string;
}

export interface MsgTransferONFTResponse {
}

export interface MsgBurnONFT {
    id: string;
    denomId: string;
    sender: string;
}

export interface MsgBurnONFTResponse {
}

function createBaseMsgCreateDenom(): MsgCreateDenom {
    return {
        id: "",
        symbol: "",
        name: "",
        description: "",
        previewUri: "",
        schema: "",
        sender: "",
    };
}

export const MsgCreateDenom = {
    encode(message: MsgCreateDenom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.description !== "") {
            writer.uint32(34).string(message.description);
        }
        if (message.previewUri !== "") {
            writer.uint32(42).string(message.previewUri);
        }
        if (message.schema !== "") {
            writer.uint32(50).string(message.schema);
        }
        if (message.sender !== "") {
            writer.uint32(58).string(message.sender);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgCreateDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateDenom();
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
                    message.description = reader.string();
                    break;
                case 5:
                    message.previewUri = reader.string();
                    break;
                case 6:
                    message.schema = reader.string();
                    break;
                case 7:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgCreateDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            name: isSet(object.name) ? String(object.name) : "",
            description: isSet(object.description) ? String(object.description) : "",
            previewUri: isSet(object.previewUri) ? String(object.previewUri) : "",
            schema: isSet(object.schema) ? String(object.schema) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
        };
    },

    toJSON(message: MsgCreateDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.name !== undefined && (obj.name = message.name);
        message.description !== undefined &&
        (obj.description = message.description);
        message.previewUri !== undefined && (obj.previewUri = message.previewUri);
        message.schema !== undefined && (obj.schema = message.schema);
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCreateDenom>, I>>(
        object: I
    ): MsgCreateDenom {
        const message = createBaseMsgCreateDenom();
        message.id = object.id ?? "";
        message.symbol = object.symbol ?? "";
        message.name = object.name ?? "";
        message.description = object.description ?? "";
        message.previewUri = object.previewUri ?? "";
        message.schema = object.schema ?? "";
        message.sender = object.sender ?? "";
        return message;
    },
};

function createBaseMsgCreateDenomResponse(): MsgCreateDenomResponse {
    return {};
}

export const MsgCreateDenomResponse = {
    encode(_: MsgCreateDenomResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgCreateDenomResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateDenomResponse();
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

    fromJSON(_: any): MsgCreateDenomResponse {
        return {};
    },

    toJSON(_: MsgCreateDenomResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgCreateDenomResponse>, I>>(
        _: I
    ): MsgCreateDenomResponse {
        const message = createBaseMsgCreateDenomResponse();
        return message;
    },
};

function createBaseMsgUpdateDenom(): MsgUpdateDenom {
    return {id: "", name: "", description: "", previewUri: "", sender: ""};
}

export const MsgUpdateDenom = {
    encode(message: MsgUpdateDenom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.description !== "") {
            writer.uint32(26).string(message.description);
        }
        if (message.previewUri !== "") {
            writer.uint32(34).string(message.previewUri);
        }
        if (message.sender !== "") {
            writer.uint32(42).string(message.sender);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgUpdateDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.description = reader.string();
                    break;
                case 4:
                    message.previewUri = reader.string();
                    break;
                case 5:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgUpdateDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            name: isSet(object.name) ? String(object.name) : "",
            description: isSet(object.description) ? String(object.description) : "",
            previewUri: isSet(object.previewUri) ? String(object.previewUri) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
        };
    },

    toJSON(message: MsgUpdateDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.name !== undefined && (obj.name = message.name);
        message.description !== undefined &&
        (obj.description = message.description);
        message.previewUri !== undefined && (obj.previewUri = message.previewUri);
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgUpdateDenom>, I>>(
        object: I
    ): MsgUpdateDenom {
        const message = createBaseMsgUpdateDenom();
        message.id = object.id ?? "";
        message.name = object.name ?? "";
        message.description = object.description ?? "";
        message.previewUri = object.previewUri ?? "";
        message.sender = object.sender ?? "";
        return message;
    },
};

function createBaseMsgUpdateDenomResponse(): MsgUpdateDenomResponse {
    return {};
}

export const MsgUpdateDenomResponse = {
    encode(_: MsgUpdateDenomResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgUpdateDenomResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateDenomResponse();
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

    fromJSON(_: any): MsgUpdateDenomResponse {
        return {};
    },

    toJSON(_: MsgUpdateDenomResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgUpdateDenomResponse>, I>>(
        _: I
    ): MsgUpdateDenomResponse {
        const message = createBaseMsgUpdateDenomResponse();
        return message;
    },
};

function createBaseMsgTransferDenom(): MsgTransferDenom {
    return {id: "", sender: "", recipient: ""};
}

export const MsgTransferDenom = {
    encode(message: MsgTransferDenom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.sender !== "") {
            writer.uint32(18).string(message.sender);
        }
        if (message.recipient !== "") {
            writer.uint32(26).string(message.recipient);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgTransferDenom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransferDenom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.sender = reader.string();
                    break;
                case 3:
                    message.recipient = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgTransferDenom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
            recipient: isSet(object.recipient) ? String(object.recipient) : "",
        };
    },

    toJSON(message: MsgTransferDenom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.sender !== undefined && (obj.sender = message.sender);
        message.recipient !== undefined && (obj.recipient = message.recipient);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgTransferDenom>, I>>(
        object: I
    ): MsgTransferDenom {
        const message = createBaseMsgTransferDenom();
        message.id = object.id ?? "";
        message.sender = object.sender ?? "";
        message.recipient = object.recipient ?? "";
        return message;
    },
};

function createBaseMsgTransferDenomResponse(): MsgTransferDenomResponse {
    return {};
}

export const MsgTransferDenomResponse = {
    encode(
        _: MsgTransferDenomResponse,
        writer: Writer = Writer.create()
    ): Writer {
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): MsgTransferDenomResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransferDenomResponse();
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

    fromJSON(_: any): MsgTransferDenomResponse {
        return {};
    },

    toJSON(_: MsgTransferDenomResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgTransferDenomResponse>, I>>(
        _: I
    ): MsgTransferDenomResponse {
        const message = createBaseMsgTransferDenomResponse();
        return message;
    },
};

function createBaseMsgMintONFT(): MsgMintONFT {
    return {
        id: "",
        denomId: "",
        metadata: undefined,
        data: "",
        transferable: false,
        extensible: false,
        nsfw: false,
        royaltyShare: "",
        sender: "",
        recipient: "",
    };
}

export const MsgMintONFT = {
    encode(message: MsgMintONFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.denomId !== "") {
            writer.uint32(18).string(message.denomId);
        }
        if (message.metadata !== undefined) {
            Metadata.encode(message.metadata, writer.uint32(26).fork()).ldelim();
        }
        if (message.data !== "") {
            writer.uint32(34).string(message.data);
        }
        if (message.transferable === true) {
            writer.uint32(40).bool(message.transferable);
        }
        if (message.extensible === true) {
            writer.uint32(48).bool(message.extensible);
        }
        if (message.nsfw === true) {
            writer.uint32(56).bool(message.nsfw);
        }
        if (message.royaltyShare !== "") {
            writer.uint32(66).string(message.royaltyShare);
        }
        if (message.sender !== "") {
            writer.uint32(74).string(message.sender);
        }
        if (message.recipient !== "") {
            writer.uint32(82).string(message.recipient);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgMintONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMintONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.denomId = reader.string();
                    break;
                case 3:
                    message.metadata = Metadata.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.data = reader.string();
                    break;
                case 5:
                    message.transferable = reader.bool();
                    break;
                case 6:
                    message.extensible = reader.bool();
                    break;
                case 7:
                    message.nsfw = reader.bool();
                    break;
                case 8:
                    message.royaltyShare = reader.string();
                    break;
                case 9:
                    message.sender = reader.string();
                    break;
                case 10:
                    message.recipient = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgMintONFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            metadata: isSet(object.metadata)
                ? Metadata.fromJSON(object.metadata)
                : undefined,
            data: isSet(object.data) ? String(object.data) : "",
            transferable: isSet(object.transferable)
                ? Boolean(object.transferable)
                : false,
            extensible: isSet(object.extensible) ? Boolean(object.extensible) : false,
            nsfw: isSet(object.nsfw) ? Boolean(object.nsfw) : false,
            royaltyShare: isSet(object.royaltyShare)
                ? String(object.royaltyShare)
                : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
            recipient: isSet(object.recipient) ? String(object.recipient) : "",
        };
    },

    toJSON(message: MsgMintONFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.metadata !== undefined &&
        (obj.metadata = message.metadata
            ? Metadata.toJSON(message.metadata)
            : undefined);
        message.data !== undefined && (obj.data = message.data);
        message.transferable !== undefined &&
        (obj.transferable = message.transferable);
        message.extensible !== undefined && (obj.extensible = message.extensible);
        message.nsfw !== undefined && (obj.nsfw = message.nsfw);
        message.royaltyShare !== undefined &&
        (obj.royaltyShare = message.royaltyShare);
        message.sender !== undefined && (obj.sender = message.sender);
        message.recipient !== undefined && (obj.recipient = message.recipient);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgMintONFT>, I>>(
        object: I
    ): MsgMintONFT {
        const message = createBaseMsgMintONFT();
        message.id = object.id ?? "";
        message.denomId = object.denomId ?? "";
        message.metadata =
            object.metadata !== undefined && object.metadata !== null
                ? Metadata.fromPartial(object.metadata)
                : undefined;
        message.data = object.data ?? "";
        message.transferable = object.transferable ?? false;
        message.extensible = object.extensible ?? false;
        message.nsfw = object.nsfw ?? false;
        message.royaltyShare = object.royaltyShare ?? "";
        message.sender = object.sender ?? "";
        message.recipient = object.recipient ?? "";
        return message;
    },
};

function createBaseMsgMintONFTResponse(): MsgMintONFTResponse {
    return {};
}

export const MsgMintONFTResponse = {
    encode(_: MsgMintONFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgMintONFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMintONFTResponse();
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

    fromJSON(_: any): MsgMintONFTResponse {
        return {};
    },

    toJSON(_: MsgMintONFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgMintONFTResponse>, I>>(
        _: I
    ): MsgMintONFTResponse {
        const message = createBaseMsgMintONFTResponse();
        return message;
    },
};

function createBaseMsgTransferONFT(): MsgTransferONFT {
    return {id: "", denomId: "", sender: "", recipient: ""};
}

export const MsgTransferONFT = {
    encode(message: MsgTransferONFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.denomId !== "") {
            writer.uint32(18).string(message.denomId);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        if (message.recipient !== "") {
            writer.uint32(34).string(message.recipient);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgTransferONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransferONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.denomId = reader.string();
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

    fromJSON(object: any): MsgTransferONFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
            recipient: isSet(object.recipient) ? String(object.recipient) : "",
        };
    },

    toJSON(message: MsgTransferONFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.sender !== undefined && (obj.sender = message.sender);
        message.recipient !== undefined && (obj.recipient = message.recipient);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgTransferONFT>, I>>(
        object: I
    ): MsgTransferONFT {
        const message = createBaseMsgTransferONFT();
        message.id = object.id ?? "";
        message.denomId = object.denomId ?? "";
        message.sender = object.sender ?? "";
        message.recipient = object.recipient ?? "";
        return message;
    },
};

function createBaseMsgTransferONFTResponse(): MsgTransferONFTResponse {
    return {};
}

export const MsgTransferONFTResponse = {
    encode(_: MsgTransferONFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgTransferONFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransferONFTResponse();
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

    fromJSON(_: any): MsgTransferONFTResponse {
        return {};
    },

    toJSON(_: MsgTransferONFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgTransferONFTResponse>, I>>(
        _: I
    ): MsgTransferONFTResponse {
        const message = createBaseMsgTransferONFTResponse();
        return message;
    },
};

function createBaseMsgBurnONFT(): MsgBurnONFT {
    return {id: "", denomId: "", sender: ""};
}

export const MsgBurnONFT = {
    encode(message: MsgBurnONFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.denomId !== "") {
            writer.uint32(18).string(message.denomId);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgBurnONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBurnONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.denomId = reader.string();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): MsgBurnONFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            sender: isSet(object.sender) ? String(object.sender) : "",
        };
    },

    toJSON(message: MsgBurnONFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgBurnONFT>, I>>(
        object: I
    ): MsgBurnONFT {
        const message = createBaseMsgBurnONFT();
        message.id = object.id ?? "";
        message.denomId = object.denomId ?? "";
        message.sender = object.sender ?? "";
        return message;
    },
};

function createBaseMsgBurnONFTResponse(): MsgBurnONFTResponse {
    return {};
}

export const MsgBurnONFTResponse = {
    encode(_: MsgBurnONFTResponse, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): MsgBurnONFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBurnONFTResponse();
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

    fromJSON(_: any): MsgBurnONFTResponse {
        return {};
    },

    toJSON(_: MsgBurnONFTResponse): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<MsgBurnONFTResponse>, I>>(
        _: I
    ): MsgBurnONFTResponse {
        const message = createBaseMsgBurnONFTResponse();
        return message;
    },
};

export interface Msg {
    CreateDenom(request: MsgCreateDenom): Promise<MsgCreateDenomResponse>;

    UpdateDenom(request: MsgUpdateDenom): Promise<MsgUpdateDenomResponse>;

    TransferDenom(request: MsgTransferDenom): Promise<MsgTransferDenomResponse>;

    MintONFT(request: MsgMintONFT): Promise<MsgMintONFTResponse>;

    TransferONFT(request: MsgTransferONFT): Promise<MsgTransferONFTResponse>;

    BurnONFT(request: MsgBurnONFT): Promise<MsgBurnONFTResponse>;
}

export class MsgClientImpl implements Msg {
    private readonly rpc: Rpc;

    constructor(rpc: Rpc) {
        this.rpc = rpc;
        this.CreateDenom = this.CreateDenom.bind(this);
        this.UpdateDenom = this.UpdateDenom.bind(this);
        this.TransferDenom = this.TransferDenom.bind(this);
        this.MintONFT = this.MintONFT.bind(this);
        this.TransferONFT = this.TransferONFT.bind(this);
        this.BurnONFT = this.BurnONFT.bind(this);
    }

    CreateDenom(request: MsgCreateDenom): Promise<MsgCreateDenomResponse> {
        const data = MsgCreateDenom.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "CreateDenom",
            data
        );
        return promise.then((data) =>
            MsgCreateDenomResponse.decode(new Reader(data))
        );
    }

    UpdateDenom(request: MsgUpdateDenom): Promise<MsgUpdateDenomResponse> {
        const data = MsgUpdateDenom.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "UpdateDenom",
            data
        );
        return promise.then((data) =>
            MsgUpdateDenomResponse.decode(new Reader(data))
        );
    }

    TransferDenom(request: MsgTransferDenom): Promise<MsgTransferDenomResponse> {
        const data = MsgTransferDenom.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "TransferDenom",
            data
        );
        return promise.then((data) =>
            MsgTransferDenomResponse.decode(new Reader(data))
        );
    }

    MintONFT(request: MsgMintONFT): Promise<MsgMintONFTResponse> {
        const data = MsgMintONFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "MintONFT",
            data
        );
        return promise.then((data) => MsgMintONFTResponse.decode(new Reader(data)));
    }

    TransferONFT(request: MsgTransferONFT): Promise<MsgTransferONFTResponse> {
        const data = MsgTransferONFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "TransferONFT",
            data
        );
        return promise.then((data) =>
            MsgTransferONFTResponse.decode(new Reader(data))
        );
    }

    BurnONFT(request: MsgBurnONFT): Promise<MsgBurnONFTResponse> {
        const data = MsgBurnONFT.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Msg",
            "BurnONFT",
            data
        );
        return promise.then((data) => MsgBurnONFTResponse.decode(new Reader(data)));
    }
}

interface Rpc {
    request(
        service: string,
        method: string,
        data: Uint8Array
    ): Promise<Uint8Array>;
}

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
