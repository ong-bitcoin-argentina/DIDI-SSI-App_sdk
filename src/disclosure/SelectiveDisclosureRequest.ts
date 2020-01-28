import Credentials from "uport-credentials/lib/Credentials";

import { SelectiveDisclosureSpecs, SelectiveDisclosureSpecsCodec } from "./common/SelectiveDisclosureSpecs";

import { DidiDocument } from "../model/DidiDocument";

import { SelectiveDisclosureProposal } from "./SelectiveDisclosureProposal";

export interface SelectiveDisclosureRequest extends SelectiveDisclosureSpecs {
	type: "SelectiveDisclosureRequest";
}

const codec = SelectiveDisclosureSpecsCodec("SelectiveDisclosureRequest", "shareReq");

export const SelectiveDisclosureRequest = {
	...DidiDocument,

	async fulfilling(credentials: Credentials, proposal: SelectiveDisclosureProposal): Promise<string> {
		const transport = SelectiveDisclosureRequest.codec.encode({
			...proposal,
			type: "SelectiveDisclosureRequest"
		});
		return credentials.signJWT(transport);
	},

	codec
};
