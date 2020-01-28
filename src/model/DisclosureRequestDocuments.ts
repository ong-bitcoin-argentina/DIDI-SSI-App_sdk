import { DidiDocument } from "./DidiDocument";
import { EthrDID } from "./EthrDID";

export interface DisclosureRequestDocuments extends DidiDocument {
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
