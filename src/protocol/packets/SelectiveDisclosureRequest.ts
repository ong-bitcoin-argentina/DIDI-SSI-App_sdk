import * as t from "io-ts";
import Credentials from "uport-credentials/lib/Credentials";

import { SelectiveDisclosureSpecCodec } from "../common/SelectiveDisclosureSpecs";

import { ProposalDocument } from "../../model/DisclosureDocuments";

const outerType = t.type({
	type: t.literal("shareReq")
});
const innerType = t.type({
	type: t.literal("SelectiveDisclosureRequest")
});

const codec = t.intersection([
	SelectiveDisclosureSpecCodec,
	outerType.pipe(
		new t.Type<typeof innerType._A, typeof outerType._A, typeof outerType._A>(
			"SelectiveDisclosureRequestType",
			innerType.is,
			(i, c) => t.success({ type: "SelectiveDisclosureRequest" }),
			a => ({
				type: "shareReq"
			})
		)
	)
]);

export type SelectiveDisclosureRequest = typeof codec._A;

export const SelectiveDisclosureRequest = {
	fulfilling: (proposal: ProposalDocument): SelectiveDisclosureRequest => {
		return { ...proposal, type: "SelectiveDisclosureRequest" };
	},

	async signJWT(credentials: Credentials, content: SelectiveDisclosureRequest): Promise<string> {
		const transport = SelectiveDisclosureRequest.codec.encode(content);
		return credentials.signJWT(transport);
	},

	codec
};
