import { DidiDocument } from "../../model/DidiDocument";
import { EthrDID } from "../../model/EthrDID";

export type VerifiableSpecIssuerSelector = Array<{
	did: EthrDID;
	url?: string;
}>;

export type VerifiableSpecSelector = {
	essential?: boolean | undefined;
	iss?: VerifiableSpecIssuerSelector;
	jwt?: string;
	reason?: string;
};

export interface SelectiveDisclosureSpecs extends DidiDocument {
	callback?: string;
	ownClaims: {
		[x: string]: {
			essential?: boolean;
			reason?: string;
		};
	};
	verifiedClaims: {
		[x: string]: VerifiableSpecSelector;
	};
}
