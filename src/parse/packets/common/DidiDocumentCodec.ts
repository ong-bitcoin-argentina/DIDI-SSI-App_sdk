import * as t from "io-ts";

import { DidiDocument } from "../../../model/DidiDocument";

import { EthrDIDCodec } from "./EthrDIDCodec";

const DidiDocumentOuterCodec = t.intersection([
	t.type(
		{
			iss: EthrDIDCodec
		},
		"DidiDocument"
	),
	t.partial(
		{
			iat: t.number,
			exp: t.number,
			delegator: EthrDIDCodec
		},
		"DidiDocument"
	)
]);
type DidiDocumentTransport = typeof DidiDocumentOuterCodec._A;

export type WithoutJWT<T> = Omit<T, "jwt">;

const DocumentCodec = DidiDocumentOuterCodec.pipe(
	new t.Type<WithoutJWT<DidiDocument>, DidiDocumentTransport, DidiDocumentTransport>(
		"DidiDocument_In",
		(u): u is DidiDocument => true,
		(i, c) =>
			t.success({
				issuer: i.iss,
				expireAt: i.exp,
				issuedAt: i.iat,
				delegator: i.delegator
			}),
		a => {
			return {
				iss: a.issuer,
				exp: a.expireAt,
				iat: a.issuedAt,
				delegator: a.delegator
			};
		}
	),
	"___"
);

export type WithoutDidiDocument<T> = Omit<T, keyof DidiDocument>;

export type DidiDocumentCodec<T> = t.Type<WithoutDidiDocument<T> & WithoutJWT<DidiDocument>, any, unknown>;

export function wrapDidiDocumentCodec<T>(codec: t.Type<WithoutDidiDocument<T>, any, unknown>): DidiDocumentCodec<T> {
	return t.intersection([codec, DocumentCodec]);
}
