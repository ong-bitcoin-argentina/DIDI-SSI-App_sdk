import { SelectiveDisclosureSpecsCodec } from "./common/SelectiveDisclosureSpecsCodec";

import { SelectiveDisclosureRequest } from "../../disclosure/SelectiveDisclosureRequest";

export const SelectiveDisclosureRequestCodec = SelectiveDisclosureSpecsCodec<
	SelectiveDisclosureRequest,
	"SelectiveDisclosureRequest",
	"shareReq"
>("SelectiveDisclosureRequest", "shareReq");
