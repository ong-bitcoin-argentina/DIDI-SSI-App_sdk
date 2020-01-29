import Credentials from "uport-credentials/lib/Credentials";

import TypedObject from "../util/TypedObject";
import { SelectiveDisclosureSpecs, VerifiableSpecSelector } from "./common/SelectiveDisclosureSpecs";

import { CredentialDocument } from "../model/CredentialDocument";
import { DidiDocument } from "../model/DidiDocument";
import { SelectiveDisclosureProposalCodec } from "../parse/packets/SelectiveDisclosureProposalCodec";

/**
 * Solicita a su destinatario responder con un SelectiveDisclosureRequest determinado
 */
export interface SelectiveDisclosureProposal extends SelectiveDisclosureSpecs {
	type: "SelectiveDisclosureProposal";
}

export const SelectiveDisclosureProposal = {
	...DidiDocument,

	offering(credentials: Credentials, offer: CredentialDocument[]): Promise<string> {
		const verifiedClaims = TypedObject.mapValues(
			TypedObject.fromEntries(offer.map(doc => [doc.title, doc])),
			(doc): VerifiableSpecSelector => ({
				essential: true,
				iss: [{ did: doc.issuer }]
			})
		);
		const transport = SelectiveDisclosureProposalCodec.encode({
			type: "SelectiveDisclosureProposal",
			ownClaims: {},
			verifiedClaims,
			issuer: offer[0].subject
		});
		return credentials.signJWT(transport);
	}
};
