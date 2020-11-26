import { verifyJWT } from "did-jwt";
import { verifyCredential } from "did-jwt-vc";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { array } from "fp-ts/lib/Array";
import { Either, either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import JWTDecode from "jwt-decode";

import TypedArray from "../util/TypedArray";
import { DidiDocumentCodec } from "./packets/common/DidiDocumentCodec";

import { SelectiveDisclosureProposal } from "../disclosure/SelectiveDisclosureProposal";
import { SelectiveDisclosureRequest } from "../disclosure/SelectiveDisclosureRequest";
import { SelectiveDisclosureResponse } from "../disclosure/SelectiveDisclosureResponse";
import { CredentialDocument } from "../model/CredentialDocument";
import { EthrDID } from "../model/EthrDID";
import { SpecialCredentialFlag } from "../model/SpecialCredential";

import { ForwardedRequestCodec } from "./packets/ForwardedRequestCodec";
import { SelectiveDisclosureProposalCodec } from "./packets/SelectiveDisclosureProposalCodec";
import { SelectiveDisclosureRequestCodec } from "./packets/SelectiveDisclosureRequestCodec";
import { SelectiveDisclosureResponseCodec } from "./packets/SelectiveDisclosureResponseCodec";
import { VerifiedClaim, VerifiedClaimCodec } from "./packets/VerifiedClaimCodec";
import { DidRegistryClient } from "./verification/DidRegistryClient";

const log = console.log;

// This is required by verifyJWT
if (typeof Buffer === "undefined") {
	// tslint:disable-next-line: no-var-requires
	global.Buffer = require("buffer").Buffer;
}

const PublicCodec = t.union(
	[
		SelectiveDisclosureResponseCodec,
		SelectiveDisclosureRequestCodec,
		SelectiveDisclosureProposalCodec,
		VerifiedClaimCodec
	],
	"___"
);
const ParseCodec = t.union([PublicCodec, ForwardedRequestCodec], "___");

export type JWTParseError =
	| {
			type: "AFTER_EXP" | "BEFORE_IAT";
			expected: number;
			current: number;
	  }
	| {
			type: "JWT_DECODE_ERROR" | "VERIFICATION_ERROR" | "DELEGATE_CHECK_ERROR";
			error: any;
	  }
	| {
			type: "SHAPE_DECODE_ERROR";
			errorMessage: string;
	  }
	| {
			type: "MISSING_DELEGATION_ERROR";
			delegator: EthrDID;
			delegate: EthrDID;
	  }
	| {
			type: "NONCREDENTIAL_WRAP_ERROR";
	  }
	| {
			type: "RESOLVER_CREATION_ERROR";
	  };

export type JWTParseResult = Either<
	JWTParseError,
	SelectiveDisclosureResponse | SelectiveDisclosureRequest | SelectiveDisclosureProposal | CredentialDocument
>;

function extractIoError(errors: t.Errors): string {
	function getContextPath(context: t.Context): string {
		return TypedArray.flatMap(
			context.map(c => (c.type.name === "___" ? undefined : c)),
			val => val
		)
			.map((c, index) => (index === 0 ? c.type.name : `${c.key}:${c.type.name}`))
			.join("/");
	}
	return errors
		.map((e): string => {
			return e.message
				? e.message
				: "Invalid value " + JSON.stringify(e.value) + " supplied to " + getContextPath(e.context);
		})
		.join("\n\n");
}

/**
 * Extrae la data contenida en un JWT en formato didi. No verifica que la firma
 * sea correcta o que corresponda con el issuer, solo que la data este bien
 * formada.
 * @see parseJWT
 */
export function unverifiedParseJWT(jwt: string): JWTParseResult {
	try {
		const decoded = JWTDecode(jwt);
		const parsed = ParseCodec.decode(decoded);
		if (isLeft(parsed)) {
			log(parsed.left);
			return left({ type: "SHAPE_DECODE_ERROR", errorMessage: extractIoError(parsed.left) });
		}

		const unverified = parsed.right;
		const now = Math.floor(Date.now() / 1000);

		if (unverified.expireAt !== undefined && unverified.expireAt < now) {
			return left({ type: "AFTER_EXP", expected: unverified.expireAt, current: now });
		} else if (unverified.issuedAt !== undefined && now < unverified.issuedAt) {
			return left({ type: "BEFORE_IAT", expected: unverified.issuedAt, current: now });
		} else {
			switch (unverified.type) {
				case "SelectiveDisclosureResponse":
					return right({ ...unverified, type: "SelectiveDisclosureResponse", jwt });
				case "SelectiveDisclosureRequest":
					return right({ ...unverified, type: "SelectiveDisclosureRequest", jwt });
				case "SelectiveDisclosureProposal":
					return right({ ...unverified, jwt });
				case "ForwardedRequest":
					return unverifiedParseJWT(unverified.forwarded);
				case "VerifiedClaim":
					const nested = parseNestedInUnverified(unverified);
					const specialFlag = SpecialCredentialFlag.extract(unverified.title, unverified.data);
					if (isLeft(nested)) {
						log(nested.left);
						return nested;
					} else {
						return right({ ...unverified, type: "CredentialDocument", jwt, nested: nested.right, specialFlag });
					}
			}
		}
	} catch (e) {
		log(e);
		return left({ type: "JWT_DECODE_ERROR", error: e });
	}
}

type Provider = {
	name: string;
	rpcUrl: string;
	registry: string;
};

export type ProviderConfig = {
	networks: Provider[];
};

interface VerifyTokenServiceConfiguration {
	identityResolver: {
		ethrUri: string;
		registryAddress?: string;
	};
	delegation: {
		ethrUri: string;
		registryAddress?: string;
	};
	providerConfig: ProviderConfig;
	audience: EthrDID | undefined;
}
async function verifyToken(
	jwt: string,
	type: string,
	services: VerifyTokenServiceConfiguration
): Promise<Either<JWTParseError, unknown>> {
	try {
		try {
			const ethrDidResolver = getResolver(services.providerConfig);
			const resolver = new Resolver(ethrDidResolver);

			const { payload } =
				type === "CredentialDocument"
					? await verifyCredential(jwt, resolver)
					: await verifyJWT(jwt, { resolver, audience: services.audience?.did?.() });
			return right(payload);
		} catch (e) {
			log(e);
			return left({ type: "VERIFICATION_ERROR", error: e });
		}
	} catch (e) {
		log(e);
		return left({ type: "RESOLVER_CREATION_ERROR" });
	}
}

/**
 * Extrae la data contenida en un JWT en formato didi, verificando que la firma
 * sea correcta y corresponda con el issuer.
 * @param jwt
 * @param ethrUri
 * URI indicando un proveedor RPC de una red ethereum
 * @param audience
 * En caso que el token indique un DID en el campo "aud", este parametro debe
 * coincidir con el valor del mismo.
 * @see unverifiedParseJWT
 */
export async function parseJWT(jwt: string, services: VerifyTokenServiceConfiguration): Promise<JWTParseResult> {
	const unverifiedContent = unverifiedParseJWT(jwt);
	if (isLeft(unverifiedContent)) {
		log(unverifiedContent.left);
		return unverifiedContent;
	}

	const payload = await verifyToken(jwt, unverifiedContent.right.type, services);
	if (isLeft(payload)) {
		log(payload.left);
		return payload;
	}

	const parsed = ParseCodec.decode(payload.right);
	if (isLeft(parsed)) {
		log(parsed.left);
		return left({ type: "SHAPE_DECODE_ERROR", errorMessage: extractIoError(parsed.left) });
	}

	const verified = parsed.right;
	if (verified.delegator) {
		try {
			const delegationRegistry = new DidRegistryClient(
				services.delegation.ethrUri,
				services.delegation.registryAddress
			);
			const isDelegationValid = await delegationRegistry.isValidDelegation(verified.delegator, verified.issuer);
			if (!isDelegationValid) {
				return left({
					type: "MISSING_DELEGATION_ERROR",
					delegator: verified.delegator,
					delegate: verified.issuer
				});
			}
		} catch (error) {
			log(error);
			return left({
				type: "DELEGATE_CHECK_ERROR",
				error
			});
		}
	}

	switch (verified.type) {
		case "SelectiveDisclosureResponse":
			return right({ ...verified, type: "SelectiveDisclosureResponse", jwt });
		case "SelectiveDisclosureRequest":
			return right({ ...verified, type: "SelectiveDisclosureRequest", jwt });
		case "SelectiveDisclosureProposal":
			return right({ ...verified, jwt });
		case "ForwardedRequest":
			return parseJWT(verified.forwarded, services);
		case "VerifiedClaim":
			const nested = await parseNestedInVerified(verified, services);
			if (isLeft(nested)) {
				log(nested.left);
				return left(nested.left);
			} else {
				const specialFlag = SpecialCredentialFlag.extract(verified.title, verified.data);
				return right({ ...verified, type: "CredentialDocument", jwt, nested: nested.right, specialFlag });
			}
	}
}

function extractCredentials(
	items: Array<
		SelectiveDisclosureResponse | SelectiveDisclosureRequest | SelectiveDisclosureProposal | CredentialDocument
	>
): Either<JWTParseError, CredentialDocument[]> {
	if (items.every(x => x.type === "CredentialDocument")) {
		return right(items as CredentialDocument[]);
	} else {
		return left({ type: "NONCREDENTIAL_WRAP_ERROR" });
	}
}

function parseNestedInUnverified(vc: VerifiedClaim): Either<JWTParseError, CredentialDocument[]> {
	const nested = Object.values(vc.wrapped);
	const parsed = nested.map(unverifiedParseJWT);
	const mix = array.sequence(either)(parsed);
	if (isLeft(mix)) {
		log(mix.left);
		return mix;
	} else {
		return extractCredentials(mix.right);
	}
}

async function parseNestedInVerified(
	vc: VerifiedClaim,
	services: VerifyTokenServiceConfiguration
): Promise<Either<JWTParseError, CredentialDocument[]>> {
	const nested = Object.values(vc.wrapped);
	const parsed = await Promise.all(nested.map(micro => parseJWT(micro, services)));
	const mix = array.sequence(either)(parsed);
	if (isLeft(mix)) {
		log(mix.left);
		return mix;
	} else {
		return extractCredentials(mix.right);
	}
}
