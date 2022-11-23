/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {PageRequest, PageResponse,} from "../../cosmos/base/query/v1beta1/pagination";
import {Collection, Denom, ONFT} from "../../onft/v1beta1/onft";

export const protobufPackage = "OmniFlix.onft.v1beta1";

export interface QueryCollectionRequest {
    denomId: string;
    pagination: PageRequest | undefined;
}

export interface QueryCollectionResponse {
    collection: Collection | undefined;
    pagination: PageResponse | undefined;
}

export interface QueryDenomRequest {
    denomId: string;
}

export interface QueryDenomResponse {
    denom: Denom | undefined;
}

export interface QueryDenomsRequest {
    /** pagination defines an optional pagination for the request. */
    pagination: PageRequest | undefined;
    owner: string;
}

export interface QueryDenomsResponse {
    denoms: Denom[];
    pagination: PageResponse | undefined;
}

export interface QueryONFTRequest {
    denomId: string;
    id: string;
}

export interface QueryONFTResponse {
    onft: ONFT | undefined;
}

export interface QueryOwnerONFTsRequest {
    denomId: string;
    owner: string;
    pagination: PageRequest | undefined;
}

export interface QueryOwnerONFTsResponse {
    owner: string;
    collections: OwnerONFTCollection[];
    pagination: PageResponse | undefined;
}

export interface QuerySupplyRequest {
    denomId: string;
    owner: string;
}

export interface QuerySupplyResponse {
    amount: number;
}

export interface OwnerONFTCollection {
    denom: Denom | undefined;
    onfts: ONFT[];
}

function createBaseQueryCollectionRequest(): QueryCollectionRequest {
    return {denomId: "", pagination: undefined};
}

export const QueryCollectionRequest = {
    encode(
        message: QueryCollectionRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryCollectionRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryCollectionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.pagination = PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryCollectionRequest {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryCollectionRequest): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryCollectionRequest>, I>>(
        object: I
    ): QueryCollectionRequest {
        const message = createBaseQueryCollectionRequest();
        message.denomId = object.denomId ?? "";
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryCollectionResponse(): QueryCollectionResponse {
    return {collection: undefined, pagination: undefined};
}

export const QueryCollectionResponse = {
    encode(
        message: QueryCollectionResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.collection !== undefined) {
            Collection.encode(message.collection, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryCollectionResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryCollectionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.collection = Collection.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.pagination = PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryCollectionResponse {
        return {
            collection: isSet(object.collection)
                ? Collection.fromJSON(object.collection)
                : undefined,
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryCollectionResponse): unknown {
        const obj: any = {};
        message.collection !== undefined &&
        (obj.collection = message.collection
            ? Collection.toJSON(message.collection)
            : undefined);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryCollectionResponse>, I>>(
        object: I
    ): QueryCollectionResponse {
        const message = createBaseQueryCollectionResponse();
        message.collection =
            object.collection !== undefined && object.collection !== null
                ? Collection.fromPartial(object.collection)
                : undefined;
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryDenomRequest(): QueryDenomRequest {
    return {denomId: ""};
}

export const QueryDenomRequest = {
    encode(message: QueryDenomRequest, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryDenomRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryDenomRequest {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
        };
    },

    toJSON(message: QueryDenomRequest): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryDenomRequest>, I>>(
        object: I
    ): QueryDenomRequest {
        const message = createBaseQueryDenomRequest();
        message.denomId = object.denomId ?? "";
        return message;
    },
};

function createBaseQueryDenomResponse(): QueryDenomResponse {
    return {denom: undefined};
}

export const QueryDenomResponse = {
    encode(
        message: QueryDenomResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.denom !== undefined) {
            Denom.encode(message.denom, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryDenomResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = Denom.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryDenomResponse {
        return {
            denom: isSet(object.denom) ? Denom.fromJSON(object.denom) : undefined,
        };
    },

    toJSON(message: QueryDenomResponse): unknown {
        const obj: any = {};
        message.denom !== undefined &&
        (obj.denom = message.denom ? Denom.toJSON(message.denom) : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryDenomResponse>, I>>(
        object: I
    ): QueryDenomResponse {
        const message = createBaseQueryDenomResponse();
        message.denom =
            object.denom !== undefined && object.denom !== null
                ? Denom.fromPartial(object.denom)
                : undefined;
        return message;
    },
};

function createBaseQueryDenomsRequest(): QueryDenomsRequest {
    return {pagination: undefined, owner: ""};
}

export const QueryDenomsRequest = {
    encode(
        message: QueryDenomsRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryDenomsRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pagination = PageRequest.decode(reader, reader.uint32());
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

    fromJSON(object: any): QueryDenomsRequest {
        return {
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: QueryDenomsRequest): unknown {
        const obj: any = {};
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryDenomsRequest>, I>>(
        object: I
    ): QueryDenomsRequest {
        const message = createBaseQueryDenomsRequest();
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseQueryDenomsResponse(): QueryDenomsResponse {
    return {denoms: [], pagination: undefined};
}

export const QueryDenomsResponse = {
    encode(
        message: QueryDenomsResponse,
        writer: Writer = Writer.create()
    ): Writer {
        for (const v of message.denoms) {
            Denom.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryDenomsResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryDenomsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denoms.push(Denom.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryDenomsResponse {
        return {
            denoms: Array.isArray(object?.denoms)
                ? object.denoms.map((e: any) => Denom.fromJSON(e))
                : [],
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryDenomsResponse): unknown {
        const obj: any = {};
        if (message.denoms) {
            obj.denoms = message.denoms.map((e) => (e ? Denom.toJSON(e) : undefined));
        } else {
            obj.denoms = [];
        }
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryDenomsResponse>, I>>(
        object: I
    ): QueryDenomsResponse {
        const message = createBaseQueryDenomsResponse();
        message.denoms = object.denoms?.map((e) => Denom.fromPartial(e)) || [];
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryONFTRequest(): QueryONFTRequest {
    return {denomId: "", id: ""};
}

export const QueryONFTRequest = {
    encode(message: QueryONFTRequest, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.id !== "") {
            writer.uint32(18).string(message.id);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryONFTRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryONFTRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryONFTRequest {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            id: isSet(object.id) ? String(object.id) : "",
        };
    },

    toJSON(message: QueryONFTRequest): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryONFTRequest>, I>>(
        object: I
    ): QueryONFTRequest {
        const message = createBaseQueryONFTRequest();
        message.denomId = object.denomId ?? "";
        message.id = object.id ?? "";
        return message;
    },
};

function createBaseQueryONFTResponse(): QueryONFTResponse {
    return {onft: undefined};
}

export const QueryONFTResponse = {
    encode(message: QueryONFTResponse, writer: Writer = Writer.create()): Writer {
        if (message.onft !== undefined) {
            ONFT.encode(message.onft, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryONFTResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryONFTResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.onft = ONFT.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryONFTResponse {
        return {
            onft: isSet(object.onft) ? ONFT.fromJSON(object.onft) : undefined,
        };
    },

    toJSON(message: QueryONFTResponse): unknown {
        const obj: any = {};
        message.onft !== undefined &&
        (obj.onft = message.onft ? ONFT.toJSON(message.onft) : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryONFTResponse>, I>>(
        object: I
    ): QueryONFTResponse {
        const message = createBaseQueryONFTResponse();
        message.onft =
            object.onft !== undefined && object.onft !== null
                ? ONFT.fromPartial(object.onft)
                : undefined;
        return message;
    },
};

function createBaseQueryOwnerONFTsRequest(): QueryOwnerONFTsRequest {
    return {denomId: "", owner: "", pagination: undefined};
}

export const QueryOwnerONFTsRequest = {
    encode(
        message: QueryOwnerONFTsRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryOwnerONFTsRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryOwnerONFTsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.owner = reader.string();
                    break;
                case 3:
                    message.pagination = PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryOwnerONFTsRequest {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryOwnerONFTsRequest): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryOwnerONFTsRequest>, I>>(
        object: I
    ): QueryOwnerONFTsRequest {
        const message = createBaseQueryOwnerONFTsRequest();
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryOwnerONFTsResponse(): QueryOwnerONFTsResponse {
    return {owner: "", collections: [], pagination: undefined};
}

export const QueryOwnerONFTsResponse = {
    encode(
        message: QueryOwnerONFTsResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        for (const v of message.collections) {
            OwnerONFTCollection.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(26).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryOwnerONFTsResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryOwnerONFTsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.owner = reader.string();
                    break;
                case 2:
                    message.collections.push(
                        OwnerONFTCollection.decode(reader, reader.uint32())
                    );
                    break;
                case 3:
                    message.pagination = PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryOwnerONFTsResponse {
        return {
            owner: isSet(object.owner) ? String(object.owner) : "",
            collections: Array.isArray(object?.collections)
                ? object.collections.map((e: any) => OwnerONFTCollection.fromJSON(e))
                : [],
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryOwnerONFTsResponse): unknown {
        const obj: any = {};
        message.owner !== undefined && (obj.owner = message.owner);
        if (message.collections) {
            obj.collections = message.collections.map((e) =>
                e ? OwnerONFTCollection.toJSON(e) : undefined
            );
        } else {
            obj.collections = [];
        }
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryOwnerONFTsResponse>, I>>(
        object: I
    ): QueryOwnerONFTsResponse {
        const message = createBaseQueryOwnerONFTsResponse();
        message.owner = object.owner ?? "";
        message.collections =
            object.collections?.map((e) => OwnerONFTCollection.fromPartial(e)) || [];
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQuerySupplyRequest(): QuerySupplyRequest {
    return {denomId: "", owner: ""};
}

export const QuerySupplyRequest = {
    encode(
        message: QuerySupplyRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QuerySupplyRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQuerySupplyRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
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

    fromJSON(object: any): QuerySupplyRequest {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
        };
    },

    toJSON(message: QuerySupplyRequest): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        message.owner !== undefined && (obj.owner = message.owner);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QuerySupplyRequest>, I>>(
        object: I
    ): QuerySupplyRequest {
        const message = createBaseQuerySupplyRequest();
        message.denomId = object.denomId ?? "";
        message.owner = object.owner ?? "";
        return message;
    },
};

function createBaseQuerySupplyResponse(): QuerySupplyResponse {
    return {amount: 0};
}

export const QuerySupplyResponse = {
    encode(
        message: QuerySupplyResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.amount !== 0) {
            writer.uint32(8).uint64(message.amount);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QuerySupplyResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQuerySupplyResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.amount = longToNumber(reader.uint64() as Long);
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QuerySupplyResponse {
        return {
            amount: isSet(object.amount) ? Number(object.amount) : 0,
        };
    },

    toJSON(message: QuerySupplyResponse): unknown {
        const obj: any = {};
        message.amount !== undefined && (obj.amount = Math.round(message.amount));
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QuerySupplyResponse>, I>>(
        object: I
    ): QuerySupplyResponse {
        const message = createBaseQuerySupplyResponse();
        message.amount = object.amount ?? 0;
        return message;
    },
};

function createBaseOwnerONFTCollection(): OwnerONFTCollection {
    return {denom: undefined, onfts: []};
}

export const OwnerONFTCollection = {
    encode(
        message: OwnerONFTCollection,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.denom !== undefined) {
            Denom.encode(message.denom, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.onfts) {
            ONFT.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): OwnerONFTCollection {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOwnerONFTCollection();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = Denom.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.onfts.push(ONFT.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): OwnerONFTCollection {
        return {
            denom: isSet(object.denom) ? Denom.fromJSON(object.denom) : undefined,
            onfts: Array.isArray(object?.onfts)
                ? object.onfts.map((e: any) => ONFT.fromJSON(e))
                : [],
        };
    },

    toJSON(message: OwnerONFTCollection): unknown {
        const obj: any = {};
        message.denom !== undefined &&
        (obj.denom = message.denom ? Denom.toJSON(message.denom) : undefined);
        if (message.onfts) {
            obj.onfts = message.onfts.map((e) => (e ? ONFT.toJSON(e) : undefined));
        } else {
            obj.onfts = [];
        }
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<OwnerONFTCollection>, I>>(
        object: I
    ): OwnerONFTCollection {
        const message = createBaseOwnerONFTCollection();
        message.denom =
            object.denom !== undefined && object.denom !== null
                ? Denom.fromPartial(object.denom)
                : undefined;
        message.onfts = object.onfts?.map((e) => ONFT.fromPartial(e)) || [];
        return message;
    },
};

export interface Query {
    Collection(request: QueryCollectionRequest): Promise<QueryCollectionResponse>;

    Denom(request: QueryDenomRequest): Promise<QueryDenomResponse>;

    Denoms(request: QueryDenomsRequest): Promise<QueryDenomsResponse>;

    ONFT(request: QueryONFTRequest): Promise<QueryONFTResponse>;

    OwnerONFTs(request: QueryOwnerONFTsRequest): Promise<QueryOwnerONFTsResponse>;

    Supply(request: QuerySupplyRequest): Promise<QuerySupplyResponse>;
}

export class QueryClientImpl implements Query {
    private readonly rpc: Rpc;

    constructor(rpc: Rpc) {
        this.rpc = rpc;
        this.Collection = this.Collection.bind(this);
        this.Denom = this.Denom.bind(this);
        this.Denoms = this.Denoms.bind(this);
        this.ONFT = this.ONFT.bind(this);
        this.OwnerONFTs = this.OwnerONFTs.bind(this);
        this.Supply = this.Supply.bind(this);
    }

    Collection(
        request: QueryCollectionRequest
    ): Promise<QueryCollectionResponse> {
        const data = QueryCollectionRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "Collection",
            data
        );
        return promise.then((data) =>
            QueryCollectionResponse.decode(new Reader(data))
        );
    }

    Denom(request: QueryDenomRequest): Promise<QueryDenomResponse> {
        const data = QueryDenomRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "Denom",
            data
        );
        return promise.then((data) => QueryDenomResponse.decode(new Reader(data)));
    }

    Denoms(request: QueryDenomsRequest): Promise<QueryDenomsResponse> {
        const data = QueryDenomsRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "Denoms",
            data
        );
        return promise.then((data) => QueryDenomsResponse.decode(new Reader(data)));
    }

    ONFT(request: QueryONFTRequest): Promise<QueryONFTResponse> {
        const data = QueryONFTRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "ONFT",
            data
        );
        return promise.then((data) => QueryONFTResponse.decode(new Reader(data)));
    }

    OwnerONFTs(
        request: QueryOwnerONFTsRequest
    ): Promise<QueryOwnerONFTsResponse> {
        const data = QueryOwnerONFTsRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "OwnerONFTs",
            data
        );
        return promise.then((data) =>
            QueryOwnerONFTsResponse.decode(new Reader(data))
        );
    }

    Supply(request: QuerySupplyRequest): Promise<QuerySupplyResponse> {
        const data = QuerySupplyRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.onft.v1beta1.Query",
            "Supply",
            data
        );
        return promise.then((data) => QuerySupplyResponse.decode(new Reader(data)));
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
