import { SelectiveDisclosureSpecsCodec } from "./common/SelectiveDisclosureSpecsCodec";

import { SelectiveDisclosureProposal } from "../../disclosure/SelectiveDisclosureProposal";

export const SelectiveDisclosureProposalCodec = SelectiveDisclosureSpecsCodec<
	SelectiveDisclosureProposal,
	"SelectiveDisclosureProposal",
	"shareProposal"
>("SelectiveDisclosureProposal", "shareProposal");
