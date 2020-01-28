import { DidiDocument } from "./DidiDocument";
import { EthrDID } from "./EthrDID";

interface DisclosureDocuments extends DidiDocument {
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

export interface RequestDocument extends DisclosureDocuments {
	type: "RequestDocument";
}
export const RequestDocument = DidiDocument;

export interface ProposalDocument extends DisclosureDocuments {
	type: "ProposalDocument";
}
export const ProposalDocument = DidiDocument;
