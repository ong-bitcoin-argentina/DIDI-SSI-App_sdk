import * as t from "io-ts";
import Credentials from "uport-credentials/lib/Credentials";

import { VerifiableSpecIssuerSelector } from "./common/SelectiveDisclosureSpecs";

import { ClaimData } from "../model/Claim";
import { CredentialDocument } from "../model/CredentialDocument";
import { RequestDocument } from "../model/DisclosureRequestDocuments";
import { EthrDID } from "../model/EthrDID";
import { Identity } from "../model/Identity";

import { SelectiveDisclosureRequest } from "./packets/SelectiveDisclosureRequest";

const SelectiveDisclosureResponseInnerCodec = t.intersection([
	t.type({
		type: t.literal("SelectiveDisclosureResponse"),
		issuer: EthrDID.codec,
		subject: EthrDID.codec,
		requestToken: t.string,
		ownClaims: ClaimData.codec,
		verifiedClaims: t.array(t.string)
	}),
	t.partial({
		issuedAt: t.number,
		expireAt: t.number
	})
]);
export type SelectiveDisclosureResponse = typeof SelectiveDisclosureResponseInnerCodec._A;

const SelectiveDisclosureResponseOuterCodec = t.intersection([
	t.type(
		{
			type: t.literal("shareResp"),
			iss: EthrDID.codec,
			sub: EthrDID.codec,
			req: t.string,
			own: ClaimData.codec,
			verified: t.array(t.string)
		},
		"SelectiveDisclosureResponse"
	),
	t.partial(
		{
			iat: t.number,
			exp: t.number
		},
		"SelectiveDisclosureResponse"
	)
]);
type SelectiveDisclosureResponseTransport = typeof SelectiveDisclosureResponseOuterCodec._A;

const codec = SelectiveDisclosureResponseOuterCodec.pipe(
	new t.Type<SelectiveDisclosureResponse, SelectiveDisclosureResponseTransport, SelectiveDisclosureResponseTransport>(
		"SelectiveDisclosureResponse_In",
		SelectiveDisclosureResponseInnerCodec.is,
		(i, c) =>
			t.success<SelectiveDisclosureResponse>({
				type: "SelectiveDisclosureResponse",
				issuer: i.iss,
				subject: i.sub,
				requestToken: i.req,
				ownClaims: i.own,
				verifiedClaims: i.verified,
				expireAt: i.exp,
				issuedAt: i.iat
			}),
		a => {
			return {
				type: "shareResp",
				iss: a.issuer,
				sub: a.subject,
				req: a.requestToken,
				own: a.ownClaims,
				verified: a.verifiedClaims,
				exp: a.expireAt,
				iat: a.issuedAt
			};
		}
	),
	"___"
);

function selectOwnClaims(
	request: SelectiveDisclosureRequest,
	identity: Identity
): { ownClaims: ClaimData; missingRequired: string[] } {
	const ownClaims: ClaimData = {};
	const missingRequired: string[] = [];

	function insert(key: string, value: string | null | undefined) {
		if (value) {
			ownClaims[key] = value;
		}
	}

	Object.entries(request.ownClaims).forEach(([key, data]) => {
		switch (key.toLowerCase()) {
			case "nombre":
			case "names":
			case "firstnames":
				insert(key, identity.personalData.firstNames);
				break;
			case "apellido":
			case "lastnames":
				insert(key, identity.personalData.lastNames);
				break;
			case "dni":
			case "document":
				insert(key, identity.personalData.document);
				break;
			case "name":
			case "full name":
				if (identity.personalData.firstNames && identity.personalData.lastNames) {
					insert(key, `${identity.personalData.firstNames} ${identity.personalData.lastNames}`);
				}
				break;
			case "email":
				insert(key, identity.personalData.email);
				break;
			case "country":
			case "nationality":
				insert(key, identity.personalData.nationality);
				break;
			case "cellphone":
			case "phone":
				insert(key, identity.personalData.cellPhone);
				break;
			case "street":
			case "streetaddress":
				insert(key, identity.address.street);
				break;
			case "numberstreet":
			case "addressnumber":
				insert(key, identity.address.number);
				break;
			case "department":
				insert(key, identity.address.department);
				break;
			case "floor":
				insert(key, identity.address.floor);
				break;
			case "city":
			case "neighborhood":
				insert(key, identity.address.neighborhood);
				break;
			case "zipcode":
			case "postcode":
				insert(key, identity.address.postCode);
				break;
			default:
				break;
		}
		if (ownClaims[key] === undefined && data.essential) {
			missingRequired.push(key);
		}
	});
	return { ownClaims, missingRequired };
}

function matchesIssuerSelector(document: CredentialDocument, selector: VerifiableSpecIssuerSelector): boolean {
	if (selector === undefined) {
		return true;
	}

	return selector.find(sel => sel.did.did() === document.issuer.did()) !== undefined;
}

function selectVerifiedClaims(
	ownDid: EthrDID,
	request: SelectiveDisclosureRequest,
	documents: CredentialDocument[]
): { verifiedClaims: CredentialDocument[]; missingRequired: string[] } {
	const verifiedClaims: CredentialDocument[] = [];
	const missingRequired: string[] = [];

	Object.entries(request.verifiedClaims).forEach(([title, selector]) => {
		const candidates = documents
			.filter(doc => doc.subject.did() === ownDid.did())
			.map(doc => [doc, ...doc.nested])
			.reduce((acc, curr) => [...acc, ...curr], []);
		const selected = candidates.find(
			document =>
				title === document.title &&
				(selector.jwt === undefined || selector.jwt === document.jwt) &&
				matchesIssuerSelector(document, selector.iss)
		);
		if (selected) {
			verifiedClaims.push(selected);
		} else if (selector.essential) {
			missingRequired.push(title);
		}
	});

	return { verifiedClaims, missingRequired };
}

export const SelectiveDisclosureResponse = {
	getResponseClaims(
		ownDid: EthrDID,
		request: SelectiveDisclosureRequest,
		documents: CredentialDocument[],
		identity: Identity
	): { missingRequired: string[]; ownClaims: ClaimData; verifiedClaims: CredentialDocument[] } {
		const verified = selectVerifiedClaims(ownDid, request, documents);
		const own = selectOwnClaims(request, identity);

		return {
			missingRequired: [...own.missingRequired, ...verified.missingRequired],
			ownClaims: own.ownClaims,
			verifiedClaims: verified.verifiedClaims
		};
	},

	async signJWT(
		credentials: Credentials,
		request: RequestDocument,
		ownClaims: ClaimData,
		verifiedClaims: CredentialDocument[]
	): Promise<string> {
		return credentials.createDisclosureResponse({
			sub: request.issuer.did(),
			req: request.jwt,
			own: ownClaims,
			verified: verifiedClaims.map(doc => doc.jwt)
		});
	},

	async submit(args: { callback: string; token: string }) {
		return fetch(args.callback, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
			body: JSON.stringify({ access_token: args.token })
		});
	},

	codec
};
