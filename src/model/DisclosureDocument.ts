import { ClaimData } from "./Claim";
import { DidiDocument } from "./DidiDocument";
import { EthrDID } from "./EthrDID";

export interface DisclosureDocument extends DidiDocument {
	type: "DisclosureDocument";
	subject: EthrDID;
	requestToken: string;
	ownClaims: ClaimData;
	verifiedClaims: string[];
}

export const DisclosureDocument = DidiDocument;
