import * as t from "io-ts";

import { SelectiveDisclosureSpecCodec } from "../common/SelectiveDisclosureSpecs";

const outerType = t.type({
	type: t.literal("shareProposal")
});
const innerType = t.type({
	type: t.literal("SelectiveDisclosureProposal")
});

export const SelectiveDisclosureProposalCodec = t.intersection([
	SelectiveDisclosureSpecCodec,
	outerType.pipe(
		new t.Type<typeof innerType._A, typeof outerType._A, typeof outerType._A>(
			"SelectiveDisclosureProposalType",
			innerType.is,
			(i, c) => t.success({ type: "SelectiveDisclosureProposal" }),
			a => ({
				type: "shareProposal"
			})
		)
	)
]);
export type SelectiveDisclosureProposal = typeof SelectiveDisclosureProposalCodec._A;
