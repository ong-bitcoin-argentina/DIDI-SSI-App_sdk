import Credentials from "uport-credentials/lib/Credentials";

import { SelectiveDisclosureSpecCodec } from "../common/SelectiveDisclosureSpecs";

import { ProposalDocument } from "../../model/DisclosureRequestDocuments";

const codec = SelectiveDisclosureSpecCodec("SelectiveDisclosureRequest", "shareReq");

export const SelectiveDisclosureRequest = {
	async fulfilling(credentials: Credentials, proposal: ProposalDocument): Promise<string> {
		const transport = SelectiveDisclosureRequest.codec.encode({
			...proposal,
			type: "SelectiveDisclosureRequest"
		});
		return credentials.signJWT(transport);
	},

	codec
};
