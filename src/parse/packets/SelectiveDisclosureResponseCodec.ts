import * as t from "io-ts";

import { ClaimDataCodec } from "./common/ClaimDataCodec";
import { EthrDIDCodec } from "./common/EthrDIDCodec";

import { SelectiveDisclosureResponse } from "../../disclosure/SelectiveDisclosureResponse";

const SelectiveDisclosureResponseInnerCodec = t.intersection([
	t.type({
		type: t.literal("SelectiveDisclosureResponse"),
		issuer: EthrDIDCodec,
		subject: EthrDIDCodec,
		requestToken: t.string,
		ownClaims: ClaimDataCodec,
		verifiedClaims: t.array(t.string)
	}),
	t.partial({
		issuedAt: t.number,
		expireAt: t.number
	})
]);

const SelectiveDisclosureResponseOuterCodec = t.intersection([
	t.type(
		{
			type: t.literal("shareResp"),
			iss: EthrDIDCodec,
			sub: EthrDIDCodec,
			req: t.string,
			own: ClaimDataCodec,
			verified: t.array(t.string)
		},
		"SelectiveDisclosureResponse"
	),
	t.partial(
		{
			iat: t.number,
			exp: t.number
		},
		"SelectiveDisclosureResponse"
	)
]);
type SelectiveDisclosureResponseTransport = typeof SelectiveDisclosureResponseOuterCodec._A;

type WithoutJWT<T> = Omit<T, "jwt">;

export const SelectiveDisclosureResponseCodec = SelectiveDisclosureResponseOuterCodec.pipe(
	new t.Type<
		WithoutJWT<SelectiveDisclosureResponse>,
		SelectiveDisclosureResponseTransport,
		SelectiveDisclosureResponseTransport
	>(
		"SelectiveDisclosureResponse_In",
		SelectiveDisclosureResponseInnerCodec.is,
		(i, c) =>
			t.success<WithoutJWT<SelectiveDisclosureResponse>>({
				type: "SelectiveDisclosureResponse",
				issuer: i.iss,
				subject: i.sub,
				requestToken: i.req,
				ownClaims: i.own,
				verifiedClaims: i.verified,
				expireAt: i.exp,
				issuedAt: i.iat
			}),
		a => {
			return {
				type: "shareResp",
				iss: a.issuer,
				sub: a.subject,
				req: a.requestToken,
				own: a.ownClaims,
				verified: a.verifiedClaims,
				exp: a.expireAt,
				iat: a.issuedAt
			};
		}
	),
	"___"
);
