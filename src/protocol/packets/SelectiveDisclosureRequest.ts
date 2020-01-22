import * as t from "io-ts";

import { SelectiveDisclosureSpecCodec } from "../common/SelectiveDisclosureSpecs";

const outerType = t.type({
	type: t.literal("shareReq")
});
const innerType = t.type({
	type: t.literal("SelectiveDisclosureRequest")
});

export const SelectiveDisclosureRequestCodec = t.intersection([
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
export type SelectiveDisclosureRequest = typeof SelectiveDisclosureRequestCodec._A;
