import { either } from "fp-ts/lib/Either";
import * as t from "io-ts";

import { EthrDID } from "../../../model/EthrDID";

export const EthrDIDCodec = new t.Type<EthrDID, string, unknown>(
	"EthrDIDCodec",
	(x: unknown): x is EthrDID => x instanceof EthrDID,
	(u, c) =>
		either.chain(t.string.validate(u, c), s => {
			try {
				return t.success(EthrDID.fromDID(s));
			} catch (e) {
				return t.failure(u, c, (e as Error).message);
			}
		}),
	a => a.did()
);
