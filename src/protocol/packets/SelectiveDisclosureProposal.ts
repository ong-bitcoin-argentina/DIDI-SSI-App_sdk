import * as t from "io-ts";
import Credentials from "uport-credentials/lib/Credentials";

import TypedObject from "../../util/TypedObject";
import { SelectiveDisclosureSpecCodec, VerifiableSpecSelector } from "../common/SelectiveDisclosureSpecs";

import { CredentialDocument } from "../../model/CredentialDocument";

const outerType = t.type({
	type: t.literal("shareProposal")
});
const innerType = t.type({
	type: t.literal("SelectiveDisclosureProposal")
});

const codec = t.intersection([
	SelectiveDisclosureSpecCodec,
	outerType.pipe(
		new t.Type<typeof innerType._A, typeof outerType._A, typeof outerType._A>(
			"SelectiveDisclosureProposalType",
			innerType.is,
			(i, c) => t.success({ type: "SelectiveDisclosureProposal" }),
			a => ({
				type: "shareProposal"
			})
		)
	)
]);

export type SelectiveDisclosureProposal = typeof codec._A;

export const SelectiveDisclosureProposal = {
	from: (credentials: CredentialDocument[]): SelectiveDisclosureProposal => {
		const verifiedClaims = TypedObject.mapValues(
			TypedObject.fromEntries(credentials.map(doc => [doc.title, doc])),
			(doc): VerifiableSpecSelector => ({
				essential: true,
				iss: [{ did: doc.issuer }]
			})
		);
		return {
			type: "SelectiveDisclosureProposal",
			ownClaims: {},
			verifiedClaims,
			issuer: credentials[0].subject
		};
	},

	async signJWT(credentials: Credentials, content: SelectiveDisclosureProposal): Promise<string> {
		const transport = SelectiveDisclosureProposal.codec.encode(content);
		return credentials.signJWT(transport);
	},

	codec
};
