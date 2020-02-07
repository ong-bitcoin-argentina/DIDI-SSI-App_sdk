import * as t from "io-ts";

import { ClaimDataCodec } from "./common/ClaimDataCodec";
import { wrapDidiDocumentCodec } from "./common/DidiDocumentCodec";
import { EthrDIDCodec } from "./common/EthrDIDCodec";

import { SelectiveDisclosureResponse } from "../../disclosure/SelectiveDisclosureResponse";

const SelectiveDisclosureResponseOuterCodec = t.type(
	{
		type: t.literal("shareResp"),
		sub: EthrDIDCodec,
		req: t.string,
		own: ClaimDataCodec,
		verified: t.array(t.string)
	},
	"SelectiveDisclosureResponse"
);
type SelectiveDisclosureResponseTransport = typeof SelectiveDisclosureResponseOuterCodec._A;

export const SelectiveDisclosureResponseCodec = wrapDidiDocumentCodec<SelectiveDisclosureResponse>(
	SelectiveDisclosureResponseOuterCodec.pipe(
		new t.Type(
			"SelectiveDisclosureResponse_In",
			(u): u is SelectiveDisclosureResponse => true,
			(i: SelectiveDisclosureResponseTransport, c) =>
				t.success({
					type: "SelectiveDisclosureResponse",
					subject: i.sub,
					requestToken: i.req,
					ownClaims: i.own,
					verifiedClaims: i.verified
				}),
			(a): SelectiveDisclosureResponseTransport => ({
				type: "shareResp",
				sub: a.subject,
				req: a.requestToken,
				own: a.ownClaims,
				verified: a.verifiedClaims
			})
		),
		"___"
	)
);
