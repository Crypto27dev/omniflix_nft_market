/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Collection} from "../../onft/v1beta1/onft";

export const protobufPackage = "OmniFlix.onft.v1beta1";

/** GenesisState defines the nft module's genesis state. */
export interface GenesisState {
    collections: Collection[];
}

function createBaseGenesisState(): GenesisState {
    return {collections: []};
}

export const GenesisState = {
    encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
        for (const v of message.collections) {
            Collection.encode(v!, writer.uint32(10).fork()).ldelim();
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
                    message.collections.push(Collection.decode(reader, reader.uint32()));
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
            collections: Array.isArray(object?.collections)
                ? object.collections.map((e: any) => Collection.fromJSON(e))
                : [],
        };
    },

    toJSON(message: GenesisState): unknown {
        const obj: any = {};
        if (message.collections) {
            obj.collections = message.collections.map((e) =>
                e ? Collection.toJSON(e) : undefined
            );
        } else {
            obj.collections = [];
        }
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
        object: I
    ): GenesisState {
        const message = createBaseGenesisState();
        message.collections =
            object.collections?.map((e) => Collection.fromPartial(e)) || [];
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
