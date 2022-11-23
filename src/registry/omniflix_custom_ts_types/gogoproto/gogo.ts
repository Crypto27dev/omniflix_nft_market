/* eslint-disable */
import {configure, util} from "protobufjs/minimal";
import Long from "long";

export const protobufPackage = "gogoproto";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any;
    configure();
}
