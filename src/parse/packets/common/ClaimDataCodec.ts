import * as t from "io-ts";

export const ClaimValueCodec = t.union([t.string, t.number, t.null], "ClaimValue");

export const ClaimDataCodec = t.record(t.string, ClaimValueCodec);
