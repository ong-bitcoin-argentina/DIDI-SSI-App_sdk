import * as t from "io-ts";

import TypedObject from "../../../util/TypedObject";

import { wrapDidiDocumentCodec } from "./DidiDocumentCodec";
import { EthrDIDCodec } from "./EthrDIDCodec";

const VerifiableSpecCodec = t.partial({
	essential: t.boolean,
	iss: t.array(t.intersection([t.type({ did: EthrDIDCodec }, ""), t.partial({ url: t.string }, "")], "")),
	jwt: t.string,
	reason: t.string
});

const UserInfoSpecCodec = t.partial({
	essential: t.boolean,
	reason: t.string
});

function SelectiveDisclosureSpecsOuterCodec<OuterTypeLabel extends string>(outerType: OuterTypeLabel) {
	return t.intersection([
		t.type(
			{
				type: t.literal(outerType)
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
				callback: t.string
			},
			"SelectiveDisclosureSpecs"
		)
	]);
}

export function SelectiveDisclosureSpecsCodec<
	T extends { type: InnerTypeLabel },
	InnerTypeLabel extends string,
	OuterTypeLabel extends string
>(innerType: InnerTypeLabel, outerType: OuterTypeLabel) {
	const outer = SelectiveDisclosureSpecsOuterCodec(outerType);

	return wrapDidiDocumentCodec<T>(
		outer.pipe(
			new t.Type(
				"SelectiveDisclosureSpecs_In",
				(u): u is any => true,
				(i: typeof outer._A, c) =>
					t.success({
						type: innerType,
						callback: i.callback,
						ownClaims: {
							...TypedObject.fromEntries((i.requested ?? []).map(req => [req, {}])),
							...TypedObject.mapValues(i.claims?.user_info ?? {}, value => (value === null ? {} : value))
						},
						verifiedClaims: {
							...TypedObject.fromEntries((i.verified ?? []).map(req => [req, {}])),
							...TypedObject.mapValues(i.claims?.verifiable ?? {}, value => (value === null ? {} : value))
						}
					}),
				(a): typeof outer._A => {
					return {
						type: outerType,
						callback: a.callback,
						claims: {
							verifiable: a.verifiedClaims,
							user_info: a.ownClaims
						}
					};
				}
			),
			"___"
		)
	);
}
