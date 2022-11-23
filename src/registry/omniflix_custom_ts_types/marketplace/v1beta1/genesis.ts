/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Listing} from "../../marketplace/v1beta1/listing";
import {Params} from "../../marketplace/v1beta1/params";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

export interface GenesisState {
    /** NFTs that are listed in marketplace */
    listings: Listing[];
    ListingCount: number;
    params: Params | undefined;
}

function createBaseGenesisState(): GenesisState {
    return {listings: [], ListingCount: 0, params: undefined};
}

export const GenesisState = {
    encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
        for (const v of message.listings) {
            Listing.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        if (message.ListingCount !== 0) {
            writer.uint32(16).uint64(message.ListingCount);
        }
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): GenesisState {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenesisState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.listings.push(Listing.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.ListingCount = longToNumber(reader.uint64() as Long);
                    break;
                case 3:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): GenesisState {
        return {
            listings: Array.isArray(object?.listings)
                ? object.listings.map((e: any) => Listing.fromJSON(e))
                : [],
            ListingCount: isSet(object.ListingCount)
                ? Number(object.ListingCount)
                : 0,
            params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
        };
    },

    toJSON(message: GenesisState): unknown {
        const obj: any = {};
        if (message.listings) {
            obj.listings = message.listings.map((e) =>
                e ? Listing.toJSON(e) : undefined
            );
        } else {
            obj.listings = [];
        }
        message.ListingCount !== undefined &&
        (obj.ListingCount = Math.round(message.ListingCount));
        message.params !== undefined &&
        (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
        object: I
    ): GenesisState {
        const message = createBaseGenesisState();
        message.listings =
            object.listings?.map((e) => Listing.fromPartial(e)) || [];
        message.ListingCount = object.ListingCount ?? 0;
        message.params =
            object.params !== undefined && object.params !== null
                ? Params.fromPartial(object.params)
                : undefined;
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
