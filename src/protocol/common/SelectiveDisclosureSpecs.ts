import * as t from "io-ts";

import { EthrDID } from "../../model/EthrDID";

export const VerifiableSpecCodec = t.partial({
	essential: t.boolean,
	iss: t.array(t.intersection([t.type({ did: EthrDID.codec }, ""), t.partial({ url: t.string }, "")], "")),
	reason: t.string
});
export type VerifiableSpecIssuerSelector = typeof VerifiableSpecCodec._A["iss"];

export const UserInfoSpecCodec = t.partial({
	essential: t.boolean,
	reason: t.string
});
