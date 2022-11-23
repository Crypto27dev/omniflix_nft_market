/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Params} from "../../marketplace/v1beta1/params";
import {PageRequest, PageResponse,} from "../../cosmos/base/query/v1beta1/pagination";
import {Listing} from "../../marketplace/v1beta1/listing";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
    /** params defines the parameters of the module. */
    params: Params | undefined;
}

export interface QueryListingsRequest {
    owner: string;
    priceDenom: string;
    pagination: PageRequest | undefined;
}

export interface QueryListingsResponse {
    listings: Listing[];
    pagination: PageResponse | undefined;
}

export interface QueryListingRequest {
    id: string;
}

export interface QueryListingResponse {
    listing: Listing | undefined;
}

export interface QueryListingsByOwnerRequest {
    owner: string;
    pagination: PageRequest | undefined;
}

export interface QueryListingsByOwnerResponse {
    listings: Listing[];
    pagination: PageResponse | undefined;
}

export interface QueryListingByNFTIDRequest {
    nftId: string;
}

export interface QueryListingsByPriceDenomRequest {
    priceDenom: string;
    pagination: PageRequest | undefined;
}

export interface QueryListingsByPriceDenomResponse {
    listings: Listing[];
    pagination: PageResponse | undefined;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
    return {};
}

export const QueryParamsRequest = {
    encode(_: QueryParamsRequest, writer: Writer = Writer.create()): Writer {
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryParamsRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsRequest();
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

    fromJSON(_: any): QueryParamsRequest {
        return {};
    },

    toJSON(_: QueryParamsRequest): unknown {
        const obj: any = {};
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(
        _: I
    ): QueryParamsRequest {
        const message = createBaseQueryParamsRequest();
        return message;
    },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
    return {params: undefined};
}

export const QueryParamsResponse = {
    encode(
        message: QueryParamsResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryParamsResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryParamsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryParamsResponse {
        return {
            params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
        };
    },

    toJSON(message: QueryParamsResponse): unknown {
        const obj: any = {};
        message.params !== undefined &&
        (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(
        object: I
    ): QueryParamsResponse {
        const message = createBaseQueryParamsResponse();
        message.params =
            object.params !== undefined && object.params !== null
                ? Params.fromPartial(object.params)
                : undefined;
        return message;
    },
};

function createBaseQueryListingsRequest(): QueryListingsRequest {
    return {owner: "", priceDenom: "", pagination: undefined};
}

export const QueryListingsRequest = {
    encode(
        message: QueryListingsRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.priceDenom !== "") {
            writer.uint32(18).string(message.priceDenom);
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryListingsRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.owner = reader.string();
                    break;
                case 2:
                    message.priceDenom = reader.string();
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

    fromJSON(object: any): QueryListingsRequest {
        return {
            owner: isSet(object.owner) ? String(object.owner) : "",
            priceDenom: isSet(object.priceDenom) ? String(object.priceDenom) : "",
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsRequest): unknown {
        const obj: any = {};
        message.owner !== undefined && (obj.owner = message.owner);
        message.priceDenom !== undefined && (obj.priceDenom = message.priceDenom);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsRequest>, I>>(
        object: I
    ): QueryListingsRequest {
        const message = createBaseQueryListingsRequest();
        message.owner = object.owner ?? "";
        message.priceDenom = object.priceDenom ?? "";
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryListingsResponse(): QueryListingsResponse {
    return {listings: [], pagination: undefined};
}

export const QueryListingsResponse = {
    encode(
        message: QueryListingsResponse,
        writer: Writer = Writer.create()
    ): Writer {
        for (const v of message.listings) {
            Listing.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryListingsResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.listings.push(Listing.decode(reader, reader.uint32()));
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

    fromJSON(object: any): QueryListingsResponse {
        return {
            listings: Array.isArray(object?.listings)
                ? object.listings.map((e: any) => Listing.fromJSON(e))
                : [],
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsResponse): unknown {
        const obj: any = {};
        if (message.listings) {
            obj.listings = message.listings.map((e) =>
                e ? Listing.toJSON(e) : undefined
            );
        } else {
            obj.listings = [];
        }
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsResponse>, I>>(
        object: I
    ): QueryListingsResponse {
        const message = createBaseQueryListingsResponse();
        message.listings =
            object.listings?.map((e) => Listing.fromPartial(e)) || [];
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryListingRequest(): QueryListingRequest {
    return {id: ""};
}

export const QueryListingRequest = {
    encode(
        message: QueryListingRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryListingRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryListingRequest {
        return {
            id: isSet(object.id) ? String(object.id) : "",
        };
    },

    toJSON(message: QueryListingRequest): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingRequest>, I>>(
        object: I
    ): QueryListingRequest {
        const message = createBaseQueryListingRequest();
        message.id = object.id ?? "";
        return message;
    },
};

function createBaseQueryListingResponse(): QueryListingResponse {
    return {listing: undefined};
}

export const QueryListingResponse = {
    encode(
        message: QueryListingResponse,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.listing !== undefined) {
            Listing.encode(message.listing, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): QueryListingResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.listing = Listing.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryListingResponse {
        return {
            listing: isSet(object.listing)
                ? Listing.fromJSON(object.listing)
                : undefined,
        };
    },

    toJSON(message: QueryListingResponse): unknown {
        const obj: any = {};
        message.listing !== undefined &&
        (obj.listing = message.listing
            ? Listing.toJSON(message.listing)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingResponse>, I>>(
        object: I
    ): QueryListingResponse {
        const message = createBaseQueryListingResponse();
        message.listing =
            object.listing !== undefined && object.listing !== null
                ? Listing.fromPartial(object.listing)
                : undefined;
        return message;
    },
};

function createBaseQueryListingsByOwnerRequest(): QueryListingsByOwnerRequest {
    return {owner: "", pagination: undefined};
}

export const QueryListingsByOwnerRequest = {
    encode(
        message: QueryListingsByOwnerRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): QueryListingsByOwnerRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsByOwnerRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.owner = reader.string();
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

    fromJSON(object: any): QueryListingsByOwnerRequest {
        return {
            owner: isSet(object.owner) ? String(object.owner) : "",
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsByOwnerRequest): unknown {
        const obj: any = {};
        message.owner !== undefined && (obj.owner = message.owner);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsByOwnerRequest>, I>>(
        object: I
    ): QueryListingsByOwnerRequest {
        const message = createBaseQueryListingsByOwnerRequest();
        message.owner = object.owner ?? "";
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryListingsByOwnerResponse(): QueryListingsByOwnerResponse {
    return {listings: [], pagination: undefined};
}

export const QueryListingsByOwnerResponse = {
    encode(
        message: QueryListingsByOwnerResponse,
        writer: Writer = Writer.create()
    ): Writer {
        for (const v of message.listings) {
            Listing.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): QueryListingsByOwnerResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsByOwnerResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.listings.push(Listing.decode(reader, reader.uint32()));
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

    fromJSON(object: any): QueryListingsByOwnerResponse {
        return {
            listings: Array.isArray(object?.listings)
                ? object.listings.map((e: any) => Listing.fromJSON(e))
                : [],
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsByOwnerResponse): unknown {
        const obj: any = {};
        if (message.listings) {
            obj.listings = message.listings.map((e) =>
                e ? Listing.toJSON(e) : undefined
            );
        } else {
            obj.listings = [];
        }
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsByOwnerResponse>, I>>(
        object: I
    ): QueryListingsByOwnerResponse {
        const message = createBaseQueryListingsByOwnerResponse();
        message.listings =
            object.listings?.map((e) => Listing.fromPartial(e)) || [];
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryListingByNFTIDRequest(): QueryListingByNFTIDRequest {
    return {nftId: ""};
}

export const QueryListingByNFTIDRequest = {
    encode(
        message: QueryListingByNFTIDRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.nftId !== "") {
            writer.uint32(10).string(message.nftId);
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): QueryListingByNFTIDRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingByNFTIDRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nftId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): QueryListingByNFTIDRequest {
        return {
            nftId: isSet(object.nftId) ? String(object.nftId) : "",
        };
    },

    toJSON(message: QueryListingByNFTIDRequest): unknown {
        const obj: any = {};
        message.nftId !== undefined && (obj.nftId = message.nftId);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingByNFTIDRequest>, I>>(
        object: I
    ): QueryListingByNFTIDRequest {
        const message = createBaseQueryListingByNFTIDRequest();
        message.nftId = object.nftId ?? "";
        return message;
    },
};

function createBaseQueryListingsByPriceDenomRequest(): QueryListingsByPriceDenomRequest {
    return {priceDenom: "", pagination: undefined};
}

export const QueryListingsByPriceDenomRequest = {
    encode(
        message: QueryListingsByPriceDenomRequest,
        writer: Writer = Writer.create()
    ): Writer {
        if (message.priceDenom !== "") {
            writer.uint32(10).string(message.priceDenom);
        }
        if (message.pagination !== undefined) {
            PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): QueryListingsByPriceDenomRequest {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsByPriceDenomRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.priceDenom = reader.string();
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

    fromJSON(object: any): QueryListingsByPriceDenomRequest {
        return {
            priceDenom: isSet(object.priceDenom) ? String(object.priceDenom) : "",
            pagination: isSet(object.pagination)
                ? PageRequest.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsByPriceDenomRequest): unknown {
        const obj: any = {};
        message.priceDenom !== undefined && (obj.priceDenom = message.priceDenom);
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageRequest.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsByPriceDenomRequest>, I>>(object: I): QueryListingsByPriceDenomRequest {
        const message = createBaseQueryListingsByPriceDenomRequest();
        message.priceDenom = object.priceDenom ?? "";
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageRequest.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

function createBaseQueryListingsByPriceDenomResponse(): QueryListingsByPriceDenomResponse {
    return {listings: [], pagination: undefined};
}

export const QueryListingsByPriceDenomResponse = {
    encode(
        message: QueryListingsByPriceDenomResponse,
        writer: Writer = Writer.create()
    ): Writer {
        for (const v of message.listings) {
            Listing.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            PageResponse.encode(
                message.pagination,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(
        input: Reader | Uint8Array,
        length?: number
    ): QueryListingsByPriceDenomResponse {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseQueryListingsByPriceDenomResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.listings.push(Listing.decode(reader, reader.uint32()));
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

    fromJSON(object: any): QueryListingsByPriceDenomResponse {
        return {
            listings: Array.isArray(object?.listings)
                ? object.listings.map((e: any) => Listing.fromJSON(e))
                : [],
            pagination: isSet(object.pagination)
                ? PageResponse.fromJSON(object.pagination)
                : undefined,
        };
    },

    toJSON(message: QueryListingsByPriceDenomResponse): unknown {
        const obj: any = {};
        if (message.listings) {
            obj.listings = message.listings.map((e) =>
                e ? Listing.toJSON(e) : undefined
            );
        } else {
            obj.listings = [];
        }
        message.pagination !== undefined &&
        (obj.pagination = message.pagination
            ? PageResponse.toJSON(message.pagination)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<QueryListingsByPriceDenomResponse>, I>>(object: I): QueryListingsByPriceDenomResponse {
        const message = createBaseQueryListingsByPriceDenomResponse();
        message.listings =
            object.listings?.map((e) => Listing.fromPartial(e)) || [];
        message.pagination =
            object.pagination !== undefined && object.pagination !== null
                ? PageResponse.fromPartial(object.pagination)
                : undefined;
        return message;
    },
};

export interface Query {
    /** Params queries params of the marketplace module. */
    Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;

    Listings(request: QueryListingsRequest): Promise<QueryListingsResponse>;

    Listing(request: QueryListingRequest): Promise<QueryListingResponse>;

    ListingsByOwner(
        request: QueryListingsByOwnerRequest
    ): Promise<QueryListingsByOwnerResponse>;

    ListingsByPriceDenom(
        request: QueryListingsByPriceDenomRequest
    ): Promise<QueryListingsByPriceDenomResponse>;

    ListingByNftId(
        request: QueryListingByNFTIDRequest
    ): Promise<QueryListingResponse>;
}

export class QueryClientImpl implements Query {
    private readonly rpc: Rpc;

    constructor(rpc: Rpc) {
        this.rpc = rpc;
        this.Params = this.Params.bind(this);
        this.Listings = this.Listings.bind(this);
        this.Listing = this.Listing.bind(this);
        this.ListingsByOwner = this.ListingsByOwner.bind(this);
        this.ListingsByPriceDenom = this.ListingsByPriceDenom.bind(this);
        this.ListingByNftId = this.ListingByNftId.bind(this);
    }

    Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
        const data = QueryParamsRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "Params",
            data
        );
        return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
    }

    Listings(request: QueryListingsRequest): Promise<QueryListingsResponse> {
        const data = QueryListingsRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "Listings",
            data
        );
        return promise.then((data) =>
            QueryListingsResponse.decode(new Reader(data))
        );
    }

    Listing(request: QueryListingRequest): Promise<QueryListingResponse> {
        const data = QueryListingRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "Listing",
            data
        );
        return promise.then((data) =>
            QueryListingResponse.decode(new Reader(data))
        );
    }

    ListingsByOwner(
        request: QueryListingsByOwnerRequest
    ): Promise<QueryListingsByOwnerResponse> {
        const data = QueryListingsByOwnerRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "ListingsByOwner",
            data
        );
        return promise.then((data) =>
            QueryListingsByOwnerResponse.decode(new Reader(data))
        );
    }

    ListingsByPriceDenom(
        request: QueryListingsByPriceDenomRequest
    ): Promise<QueryListingsByPriceDenomResponse> {
        const data = QueryListingsByPriceDenomRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "ListingsByPriceDenom",
            data
        );
        return promise.then((data) =>
            QueryListingsByPriceDenomResponse.decode(new Reader(data))
        );
    }

    ListingByNftId(
        request: QueryListingByNFTIDRequest
    ): Promise<QueryListingResponse> {
        const data = QueryListingByNFTIDRequest.encode(request).finish();
        const promise = this.rpc.request(
            "OmniFlix.marketplace.v1beta1.Query",
            "ListingByNftId",
            data
        );
        return promise.then((data) =>
            QueryListingResponse.decode(new Reader(data))
        );
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
