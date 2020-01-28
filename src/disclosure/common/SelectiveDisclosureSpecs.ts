import * as t from "io-ts";

import TypedObject from "../../util/TypedObject";

import { DidiDocument } from "../../model/DidiDocument";
import { EthrDID } from "../../model/EthrDID";

export interface SelectiveDisclosureSpecs extends DidiDocument {
	callback?: string;
	ownClaims: {
		[x: string]: {
			essential?: boolean;
			reason?: string;
		};
	};
	verifiedClaims: {
		[x: string]: {
			essential?: boolean;
			iss?: Array<{
				did: EthrDID;
				url?: string;
			}>;
			reason?: string;
			jwt?: string;
		};
	};
}

const VerifiableSpecCodec = t.partial({
	essential: t.boolean,
	iss: t.array(t.intersection([t.type({ did: EthrDID.codec }, ""), t.partial({ url: t.string }, "")], "")),
	jwt: t.string,
	reason: t.string
});
export type VerifiableSpecSelector = typeof VerifiableSpecCodec._A;
export type VerifiableSpecIssuerSelector = typeof VerifiableSpecCodec._A["iss"];

const UserInfoSpecCodec = t.partial({
	essential: t.boolean,
	reason: t.string
});

function SelectiveDisclosureSpecsInnerCodec<InnerTypeLabel extends string>(innerType: InnerTypeLabel) {
	return t.intersection(
		[
			t.type(
				{
					type: t.literal(innerType),
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
}

function SelectiveDisclosureSpecsOuterCodec<OuterTypeLabel extends string>(outerType: OuterTypeLabel) {
	return t.intersection([
		t.type(
			{
				type: t.literal(outerType),
				iss: EthrDID.codec
			},
			"SelectiveDisclosureSpecs"
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
			"SelectiveDisclosureSpecs"
		)
	]);
}

export function SelectiveDisclosureSpecsCodec<InnerTypeLabel extends string, OuterTypeLabel extends string>(
	innerType: InnerTypeLabel,
	outerType: OuterTypeLabel
) {
	const outer = SelectiveDisclosureSpecsOuterCodec(outerType);
	const inner = SelectiveDisclosureSpecsInnerCodec(innerType);

	return SelectiveDisclosureSpecsOuterCodec(outerType).pipe(
		new t.Type<typeof inner._A, typeof outer._A, typeof outer._A>(
			"SelectiveDisclosureSpecs_In",
			inner.is,
			(i, c) =>
				t.success({
					type: innerType,
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
					type: outerType,
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
}
