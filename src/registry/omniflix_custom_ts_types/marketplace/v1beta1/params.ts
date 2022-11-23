/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";

export const protobufPackage = "OmniFlix.marketplace.v1beta1";

export interface Params {
    saleCommission: string;
    distribution: Distribution | undefined;
}

export interface Distribution {
    staking: string;
    communityPool: string;
}

function createBaseParams(): Params {
    return {saleCommission: "", distribution: undefined};
}

export const Params = {
    encode(message: Params, writer: Writer = Writer.create()): Writer {
        if (message.saleCommission !== "") {
            writer.uint32(10).string(message.saleCommission);
        }
        if (message.distribution !== undefined) {
            Distribution.encode(
                message.distribution,
                writer.uint32(18).fork()
            ).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Params {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.saleCommission = reader.string();
                    break;
                case 2:
                    message.distribution = Distribution.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Params {
        return {
            saleCommission: isSet(object.saleCommission)
                ? String(object.saleCommission)
                : "",
            distribution: isSet(object.distribution)
                ? Distribution.fromJSON(object.distribution)
                : undefined,
        };
    },

    toJSON(message: Params): unknown {
        const obj: any = {};
        message.saleCommission !== undefined &&
        (obj.saleCommission = message.saleCommission);
        message.distribution !== undefined &&
        (obj.distribution = message.distribution
            ? Distribution.toJSON(message.distribution)
            : undefined);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
        const message = createBaseParams();
        message.saleCommission = object.saleCommission ?? "";
        message.distribution =
            object.distribution !== undefined && object.distribution !== null
                ? Distribution.fromPartial(object.distribution)
                : undefined;
        return message;
    },
};

function createBaseDistribution(): Distribution {
    return {staking: "", communityPool: ""};
}

export const Distribution = {
    encode(message: Distribution, writer: Writer = Writer.create()): Writer {
        if (message.staking !== "") {
            writer.uint32(10).string(message.staking);
        }
        if (message.communityPool !== "") {
            writer.uint32(18).string(message.communityPool);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Distribution {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDistribution();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staking = reader.string();
                    break;
                case 2:
                    message.communityPool = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Distribution {
        return {
            staking: isSet(object.staking) ? String(object.staking) : "",
            communityPool: isSet(object.communityPool)
                ? String(object.communityPool)
                : "",
        };
    },

    toJSON(message: Distribution): unknown {
        const obj: any = {};
        message.staking !== undefined && (obj.staking = message.staking);
        message.communityPool !== undefined &&
        (obj.communityPool = message.communityPool);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Distribution>, I>>(
        object: I
    ): Distribution {
        const message = createBaseDistribution();
        message.staking = object.staking ?? "";
        message.communityPool = object.communityPool ?? "";
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
