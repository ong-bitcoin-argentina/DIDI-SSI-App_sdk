import Credentials from "uport-credentials/lib/Credentials";

import TypedObject from "../../util/TypedObject";
import { SelectiveDisclosureSpecCodec, VerifiableSpecSelector } from "../common/SelectiveDisclosureSpecs";

import { CredentialDocument } from "../../model/CredentialDocument";

const codec = SelectiveDisclosureSpecCodec("SelectiveDisclosureProposal", "shareProposal");

export const SelectiveDisclosureProposal = {
	offering(credentials: Credentials, offer: CredentialDocument[]): Promise<string> {
		const verifiedClaims = TypedObject.mapValues(
			TypedObject.fromEntries(offer.map(doc => [doc.title, doc])),
			(doc): VerifiableSpecSelector => ({
				essential: true,
				iss: [{ did: doc.issuer }]
			})
		);
		const transport = SelectiveDisclosureProposal.codec.encode({
			type: "SelectiveDisclosureProposal",
			ownClaims: {},
			verifiedClaims,
			issuer: offer[0].subject
		});
		return credentials.signJWT(transport);
	},

	codec
};
