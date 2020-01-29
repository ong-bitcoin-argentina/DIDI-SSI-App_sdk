import { DidiDocument } from "../../model/DidiDocument";
import { EthrDID } from "../../model/EthrDID";

export type VerifiableSpecIssuerSelector = Array<{
	did: EthrDID;
	url?: string;
}>;

export interface VerifiableSpecSelector {
	essential?: boolean;
	iss?: VerifiableSpecIssuerSelector;
	jwt?: string;
	reason?: string;
}

export interface SelectiveDisclosureSpecs extends DidiDocument {
	/** URL a la que enviar la respuesta */
	callback?: string;

	/** Selector de datos a solicitar */
	ownClaims: {
		[title: string]: {
			essential?: boolean;
			reason?: string;
		};
	};

	/** Selector de credenciales a solicitar */
	verifiedClaims: {
		[title: string]: VerifiableSpecSelector;
	};
}
