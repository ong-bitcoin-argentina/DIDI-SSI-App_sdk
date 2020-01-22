import * as t from "io-ts";

import TypedObject from "../../util/TypedObject";

import { EthrDID } from "../../model/EthrDID";

const VerifiableSpecCodec = t.partial({
	essential: t.boolean,
	iss: t.array(t.intersection([t.type({ did: EthrDID.codec }, ""), t.partial({ url: t.string }, "")], "")),
	reason: t.string
});
export type VerifiableSpecIssuerSelector = typeof VerifiableSpecCodec._A["iss"];

const UserInfoSpecCodec = t.partial({
	essential: t.boolean,
	reason: t.string
});

const SelectiveDisclosureSpecInnerCodec = t.intersection(
	[
		t.type(
			{
				issuer: EthrDID.codec,
				verifiedClaims: t.record(t.string, VerifiableSpecCodec),
				ownClaims: t.record(t.string, UserInfoSpecCodec)
			},
			""
		),
		t.partial(
			{
				issuedAt: t.number,
				expireAt: t.number,
				callback: t.string
			},
			""
		)
	],
	""
);
type SelectiveDisclosureSpec = typeof SelectiveDisclosureSpecInnerCodec._A;

const SelectiveDisclosureSpecOuterCodec = t.intersection([
	t.type(
		{
			iss: EthrDID.codec
		},
		"SelectiveDisclosureSpec"
	),
	t.partial(
		{
			claims: t.partial({
				verifiable: t.record(t.string, t.union([t.null, VerifiableSpecCodec])),
				user_info: t.record(t.string, t.union([t.null, UserInfoSpecCodec]))
			}),
			requested: t.array(t.string),
			verified: t.array(t.string),
			iat: t.number,
			exp: t.number,
			callback: t.string
		},
		"SelectiveDisclosureSpec"
	)
]);
type SelectiveDisclosureSpecTransport = typeof SelectiveDisclosureSpecOuterCodec._A;

export const SelectiveDisclosureSpecCodec = SelectiveDisclosureSpecOuterCodec.pipe(
	new t.Type<SelectiveDisclosureSpec, SelectiveDisclosureSpecTransport, SelectiveDisclosureSpecTransport>(
		"SelectiveDisclosureSpec_In",
		SelectiveDisclosureSpecInnerCodec.is,
		(i, c) =>
			t.success<SelectiveDisclosureSpec>({
				issuer: i.iss,
				callback: i.callback,
				ownClaims: {
					...TypedObject.fromEntries((i.requested ?? []).map(req => [req, {}])),
					...TypedObject.mapValues(i.claims?.user_info ?? {}, value => (value === null ? {} : value))
				},
				verifiedClaims: {
					...TypedObject.fromEntries((i.verified ?? []).map(req => [req, {}])),
					...TypedObject.mapValues(i.claims?.verifiable ?? {}, value => (value === null ? {} : value))
				},
				issuedAt: i.iat,
				expireAt: i.exp
			}),
		a => {
			return {
				iss: a.issuer,
				callback: a.callback,
				claims: {
					verifiable: a.verifiedClaims,
					user_info: a.ownClaims
				},
				iat: a.issuedAt,
				exp: a.expireAt
			};
		}
	),
	"___"
);
