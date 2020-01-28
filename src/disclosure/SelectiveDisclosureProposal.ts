import Credentials from "uport-credentials/lib/Credentials";

import TypedObject from "../util/TypedObject";
import {
	SelectiveDisclosureSpecs,
	SelectiveDisclosureSpecsCodec,
	VerifiableSpecSelector
} from "./common/SelectiveDisclosureSpecs";

import { CredentialDocument } from "../model/CredentialDocument";
import { DidiDocument } from "../model/DidiDocument";

export interface SelectiveDisclosureProposal extends SelectiveDisclosureSpecs {
	type: "SelectiveDisclosureProposal";
}

const codec = SelectiveDisclosureSpecsCodec("SelectiveDisclosureProposal", "shareProposal");

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
