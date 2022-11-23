/* eslint-disable */
import {configure, Reader, util, Writer} from "protobufjs/minimal";
import Long from "long";
import {Timestamp} from "../../google/protobuf/timestamp";

export const protobufPackage = "OmniFlix.onft.v1beta1";

/** Collection */
export interface Collection {
    denom: Denom | undefined;
    onfts: ONFT[];
}

export interface IDCollection {
    denomId: string;
    onftIds: string[];
}

export interface Denom {
    id: string;
    symbol: string;
    name: string;
    schema: string;
    creator: string;
    description: string;
    previewUri: string;
}

/** ASSET or ONFT */
export interface ONFT {
    id: string;
    metadata: Metadata | undefined;
    data: string;
    owner: string;
    transferable: boolean;
    extensible: boolean;
    createdAt: Date | undefined;
    nsfw: boolean;
    royaltyShare: string;
}

export interface Metadata {
    name: string;
    description: string;
    mediaUri: string;
    previewUri: string;
}

export interface Owner {
    address: string;
    idCollections: IDCollection[];
}

function createBaseCollection(): Collection {
    return {denom: undefined, onfts: []};
}

export const Collection = {
    encode(message: Collection, writer: Writer = Writer.create()): Writer {
        if (message.denom !== undefined) {
            Denom.encode(message.denom, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.onfts) {
            ONFT.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Collection {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCollection();
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

    fromJSON(object: any): Collection {
        return {
            denom: isSet(object.denom) ? Denom.fromJSON(object.denom) : undefined,
            onfts: Array.isArray(object?.onfts)
                ? object.onfts.map((e: any) => ONFT.fromJSON(e))
                : [],
        };
    },

    toJSON(message: Collection): unknown {
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

    fromPartial<I extends Exact<DeepPartial<Collection>, I>>(
        object: I
    ): Collection {
        const message = createBaseCollection();
        message.denom =
            object.denom !== undefined && object.denom !== null
                ? Denom.fromPartial(object.denom)
                : undefined;
        message.onfts = object.onfts?.map((e) => ONFT.fromPartial(e)) || [];
        return message;
    },
};

function createBaseIDCollection(): IDCollection {
    return {denomId: "", onftIds: []};
}

export const IDCollection = {
    encode(message: IDCollection, writer: Writer = Writer.create()): Writer {
        if (message.denomId !== "") {
            writer.uint32(10).string(message.denomId);
        }
        for (const v of message.onftIds) {
            writer.uint32(18).string(v!);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): IDCollection {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDCollection();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denomId = reader.string();
                    break;
                case 2:
                    message.onftIds.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): IDCollection {
        return {
            denomId: isSet(object.denomId) ? String(object.denomId) : "",
            onftIds: Array.isArray(object?.onftIds)
                ? object.onftIds.map((e: any) => String(e))
                : [],
        };
    },

    toJSON(message: IDCollection): unknown {
        const obj: any = {};
        message.denomId !== undefined && (obj.denomId = message.denomId);
        if (message.onftIds) {
            obj.onftIds = message.onftIds.map((e) => e);
        } else {
            obj.onftIds = [];
        }
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<IDCollection>, I>>(
        object: I
    ): IDCollection {
        const message = createBaseIDCollection();
        message.denomId = object.denomId ?? "";
        message.onftIds = object.onftIds?.map((e) => e) || [];
        return message;
    },
};

function createBaseDenom(): Denom {
    return {
        id: "",
        symbol: "",
        name: "",
        schema: "",
        creator: "",
        description: "",
        previewUri: "",
    };
}

export const Denom = {
    encode(message: Denom, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.symbol !== "") {
            writer.uint32(18).string(message.symbol);
        }
        if (message.name !== "") {
            writer.uint32(26).string(message.name);
        }
        if (message.schema !== "") {
            writer.uint32(34).string(message.schema);
        }
        if (message.creator !== "") {
            writer.uint32(42).string(message.creator);
        }
        if (message.description !== "") {
            writer.uint32(50).string(message.description);
        }
        if (message.previewUri !== "") {
            writer.uint32(58).string(message.previewUri);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Denom {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDenom();
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
                    message.schema = reader.string();
                    break;
                case 5:
                    message.creator = reader.string();
                    break;
                case 6:
                    message.description = reader.string();
                    break;
                case 7:
                    message.previewUri = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Denom {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            name: isSet(object.name) ? String(object.name) : "",
            schema: isSet(object.schema) ? String(object.schema) : "",
            creator: isSet(object.creator) ? String(object.creator) : "",
            description: isSet(object.description) ? String(object.description) : "",
            previewUri: isSet(object.previewUri) ? String(object.previewUri) : "",
        };
    },

    toJSON(message: Denom): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.name !== undefined && (obj.name = message.name);
        message.schema !== undefined && (obj.schema = message.schema);
        message.creator !== undefined && (obj.creator = message.creator);
        message.description !== undefined &&
        (obj.description = message.description);
        message.previewUri !== undefined && (obj.previewUri = message.previewUri);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Denom>, I>>(object: I): Denom {
        const message = createBaseDenom();
        message.id = object.id ?? "";
        message.symbol = object.symbol ?? "";
        message.name = object.name ?? "";
        message.schema = object.schema ?? "";
        message.creator = object.creator ?? "";
        message.description = object.description ?? "";
        message.previewUri = object.previewUri ?? "";
        return message;
    },
};

function createBaseONFT(): ONFT {
    return {
        id: "",
        metadata: undefined,
        data: "",
        owner: "",
        transferable: false,
        extensible: false,
        createdAt: undefined,
        nsfw: false,
        royaltyShare: "",
    };
}

export const ONFT = {
    encode(message: ONFT, writer: Writer = Writer.create()): Writer {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.metadata !== undefined) {
            Metadata.encode(message.metadata, writer.uint32(18).fork()).ldelim();
        }
        if (message.data !== "") {
            writer.uint32(26).string(message.data);
        }
        if (message.owner !== "") {
            writer.uint32(34).string(message.owner);
        }
        if (message.transferable === true) {
            writer.uint32(40).bool(message.transferable);
        }
        if (message.extensible === true) {
            writer.uint32(48).bool(message.extensible);
        }
        if (message.createdAt !== undefined) {
            Timestamp.encode(
                toTimestamp(message.createdAt),
                writer.uint32(58).fork()
            ).ldelim();
        }
        if (message.nsfw === true) {
            writer.uint32(64).bool(message.nsfw);
        }
        if (message.royaltyShare !== "") {
            writer.uint32(74).string(message.royaltyShare);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): ONFT {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseONFT();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.metadata = Metadata.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.data = reader.string();
                    break;
                case 4:
                    message.owner = reader.string();
                    break;
                case 5:
                    message.transferable = reader.bool();
                    break;
                case 6:
                    message.extensible = reader.bool();
                    break;
                case 7:
                    message.createdAt = fromTimestamp(
                        Timestamp.decode(reader, reader.uint32())
                    );
                    break;
                case 8:
                    message.nsfw = reader.bool();
                    break;
                case 9:
                    message.royaltyShare = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): ONFT {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            metadata: isSet(object.metadata)
                ? Metadata.fromJSON(object.metadata)
                : undefined,
            data: isSet(object.data) ? String(object.data) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
            transferable: isSet(object.transferable)
                ? Boolean(object.transferable)
                : false,
            extensible: isSet(object.extensible) ? Boolean(object.extensible) : false,
            createdAt: isSet(object.createdAt)
                ? fromJsonTimestamp(object.createdAt)
                : undefined,
            nsfw: isSet(object.nsfw) ? Boolean(object.nsfw) : false,
            royaltyShare: isSet(object.royaltyShare)
                ? String(object.royaltyShare)
                : "",
        };
    },

    toJSON(message: ONFT): unknown {
        const obj: any = {};
        message.id !== undefined && (obj.id = message.id);
        message.metadata !== undefined &&
        (obj.metadata = message.metadata
            ? Metadata.toJSON(message.metadata)
            : undefined);
        message.data !== undefined && (obj.data = message.data);
        message.owner !== undefined && (obj.owner = message.owner);
        message.transferable !== undefined &&
        (obj.transferable = message.transferable);
        message.extensible !== undefined && (obj.extensible = message.extensible);
        message.createdAt !== undefined &&
        (obj.createdAt = message.createdAt.toISOString());
        message.nsfw !== undefined && (obj.nsfw = message.nsfw);
        message.royaltyShare !== undefined &&
        (obj.royaltyShare = message.royaltyShare);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<ONFT>, I>>(object: I): ONFT {
        const message = createBaseONFT();
        message.id = object.id ?? "";
        message.metadata =
            object.metadata !== undefined && object.metadata !== null
                ? Metadata.fromPartial(object.metadata)
                : undefined;
        message.data = object.data ?? "";
        message.owner = object.owner ?? "";
        message.transferable = object.transferable ?? false;
        message.extensible = object.extensible ?? false;
        message.createdAt = object.createdAt ?? undefined;
        message.nsfw = object.nsfw ?? false;
        message.royaltyShare = object.royaltyShare ?? "";
        return message;
    },
};

function createBaseMetadata(): Metadata {
    return {name: "", description: "", mediaUri: "", previewUri: ""};
}

export const Metadata = {
    encode(message: Metadata, writer: Writer = Writer.create()): Writer {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.mediaUri !== "") {
            writer.uint32(26).string(message.mediaUri);
        }
        if (message.previewUri !== "") {
            writer.uint32(34).string(message.previewUri);
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Metadata {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMetadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.mediaUri = reader.string();
                    break;
                case 4:
                    message.previewUri = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Metadata {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            description: isSet(object.description) ? String(object.description) : "",
            mediaUri: isSet(object.mediaUri) ? String(object.mediaUri) : "",
            previewUri: isSet(object.previewUri) ? String(object.previewUri) : "",
        };
    },

    toJSON(message: Metadata): unknown {
        const obj: any = {};
        message.name !== undefined && (obj.name = message.name);
        message.description !== undefined &&
        (obj.description = message.description);
        message.mediaUri !== undefined && (obj.mediaUri = message.mediaUri);
        message.previewUri !== undefined && (obj.previewUri = message.previewUri);
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(object: I): Metadata {
        const message = createBaseMetadata();
        message.name = object.name ?? "";
        message.description = object.description ?? "";
        message.mediaUri = object.mediaUri ?? "";
        message.previewUri = object.previewUri ?? "";
        return message;
    },
};

function createBaseOwner(): Owner {
    return {address: "", idCollections: []};
}

export const Owner = {
    encode(message: Owner, writer: Writer = Writer.create()): Writer {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        for (const v of message.idCollections) {
            IDCollection.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): Owner {
        const reader = input instanceof Reader ? input : new Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOwner();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.idCollections.push(
                        IDCollection.decode(reader, reader.uint32())
                    );
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Owner {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            idCollections: Array.isArray(object?.idCollections)
                ? object.idCollections.map((e: any) => IDCollection.fromJSON(e))
                : [],
        };
    },

    toJSON(message: Owner): unknown {
        const obj: any = {};
        message.address !== undefined && (obj.address = message.address);
        if (message.idCollections) {
            obj.idCollections = message.idCollections.map((e) =>
                e ? IDCollection.toJSON(e) : undefined
            );
        } else {
            obj.idCollections = [];
        }
        return obj;
    },

    fromPartial<I extends Exact<DeepPartial<Owner>, I>>(object: I): Owner {
        const message = createBaseOwner();
        message.address = object.address ?? "";
        message.idCollections =
            object.idCollections?.map((e) => IDCollection.fromPartial(e)) || [];
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

function toTimestamp(date: Date): Timestamp {
    const seconds = date.getTime() / 1_000;
    const nanos = (date.getTime() % 1_000) * 1_000_000;
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any;
    configure();
}

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}
