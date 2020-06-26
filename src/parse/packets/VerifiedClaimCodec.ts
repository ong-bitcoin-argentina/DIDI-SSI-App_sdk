import * as t from "io-ts";

import { SingleKeyedRecordCodec } from "../../util/SingleKeyedRecord";
import { ClaimDataCodec } from "./common/ClaimDataCodec";
import { WithoutDidiDocument, wrapDidiDocumentCodec } from "./common/DidiDocumentCodec";
import { EthrDIDCodec } from "./common/EthrDIDCodec";

import { CredentialDocument } from "../../model/CredentialDocument";

const VerifiedClaimOuterCodec = t.type(
	{
		sub: EthrDIDCodec,
		vc: t.type(
			{
				"@context": t.array(t.string),
				type: t.array(t.string),
				credentialSubject: SingleKeyedRecordCodec(
					t.partial(
						{
							data: ClaimDataCodec,
							wrapped: t.record(t.string, t.string),
							category: t.keyof({
								education: null,
								livingPlace: null,
								finance: null,
								identity: null,
								benefit: null,
								work: null
							}),
							preview: t.type({
								type: t.number,
								fields: t.array(t.string)
							})
						},
						""
					)
				)
			},
			""
		)
	},
	"VerifiedClaim"
);
type VerifiedClaimTransport = typeof VerifiedClaimOuterCodec._A;

export type VerifiedClaim = Omit<CredentialDocument, "type" | "jwt" | "nested" | "specialFlag"> & {
	type: "VerifiedClaim";
	wrapped: Record<string, string>;
};

export const VerifiedClaimCodec = wrapDidiDocumentCodec<VerifiedClaim>(
	VerifiedClaimOuterCodec.pipe(
		new t.Type(
			"VerifiedClaim_In",
			(u): u is VerifiedClaim => true,
			(i: VerifiedClaimTransport, c) =>
				t.success<WithoutDidiDocument<VerifiedClaim>>({
					type: "VerifiedClaim",
					subject: i.sub,
					title: i.vc.credentialSubject.key,
					data: i.vc.credentialSubject.value.data ?? {},
					preview: i.vc.credentialSubject.value.preview,
					category: i.vc.credentialSubject.value.category,
					wrapped: i.vc.credentialSubject.value.wrapped ?? {}
				}),
			(a): VerifiedClaimTransport => ({
				sub: a.subject,
				vc: {
					"@context": ["https://www.w3.org/2018/credentials/v1"],
					type: ["VerifiableCredential"],
					credentialSubject: {
						key: a.title,
						value: {
							data: a.data,
							preview: a.preview,
							wrapped: a.wrapped,
							category: a.category
						}
					}
				}
			})
		),
		"___"
	)
);
