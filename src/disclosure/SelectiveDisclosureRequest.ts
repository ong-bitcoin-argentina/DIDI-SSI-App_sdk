import Credentials from "uport-credentials/lib/Credentials";

import { SelectiveDisclosureSpecs } from "./common/SelectiveDisclosureSpecs";

import { DidiDocument } from "../model/DidiDocument";
import { SelectiveDisclosureRequestCodec } from "../parse/packets/SelectiveDisclosureRequestCodec";

import { SelectiveDisclosureProposal } from "./SelectiveDisclosureProposal";

export interface SelectiveDisclosureRequest extends SelectiveDisclosureSpecs {
	type: "SelectiveDisclosureRequest";
}

export const SelectiveDisclosureRequest = {
	...DidiDocument,

	/**
	 * Convierte un SelectiveDisclosureProposal en su SelectiveDisclosureRequest siguiente
	 */
	async fulfilling(credentials: Credentials, proposal: SelectiveDisclosureProposal): Promise<string> {
		const transport = SelectiveDisclosureRequestCodec.encode({
			...proposal,
			type: "SelectiveDisclosureRequest"
		});
		return credentials.signJWT(transport);
	}
};
