import * as t from "io-ts";

import { wrapDidiDocumentCodec } from "./common/DidiDocumentCodec";
import { EthrDIDCodec } from "./common/EthrDIDCodec";

import { DidiDocument } from "../../model/DidiDocument";
import { EthrDID } from "../../model/EthrDID";

interface ForwardedRequest extends DidiDocument {
	type: "ForwardedRequest";
	subject: EthrDID;
	forwarded: string;
}

const ForwardedRequestOuterCodec = t.type(
	{
		sub: EthrDIDCodec,
		disclosureRequest: t.string
	},
	"ForwardedRequest"
);
type ForwardedRequestTransport = typeof ForwardedRequestOuterCodec._A;

export const ForwardedRequestCodec = wrapDidiDocumentCodec<ForwardedRequest>(
	ForwardedRequestOuterCodec.pipe(
		new t.Type(
			"ForwardedRequest_In",
			(u): u is ForwardedRequest => true,
			(i: ForwardedRequestTransport, c) =>
				t.success({
					type: "ForwardedRequest",
					subject: i.sub,
					forwarded: i.disclosureRequest
				}),
			(a): ForwardedRequestTransport => {
				return {
					sub: a.subject,
					disclosureRequest: a.forwarded
				};
			}
		),
		"___"
	)
);
