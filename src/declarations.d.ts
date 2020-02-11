declare module "ethr-did-resolver" {
	import { DIDResolver } from "did-resolver";

	export type Provider = any;

	export interface ProviderConfiguration {
		provider?: Provider;
		web3?: {
			currentProvider: Provider;
		};
		rpcUrl?: string;
	}

	export interface NetworkConfiguration extends ProviderConfiguration {
		registry?: string;
	}

	export interface ResolverConfiguration extends NetworkConfiguration {
		networks?: NetworkConfiguration[];
	}

	export const REGISTRY: string;

	export const delegateTypes: {
		Secp256k1SignatureAuthentication2018: string;
		Secp256k1VerificationKey2018: string;
	};

	export function getResolver(conf: ResolverConfiguration): { ethr: DIDResolver };
}

declare module "react-native-bcrypt" {
	function genSaltSync(rounds?: number): string;

	function hash(s: string, salt: number | string, callback: (error?: Error, hash?: string) => void): void;

	function encodeBase64(bytes: number[], maxInputLength: number): string;
	function decodeBase64(encoded: string, maxOutputLength: number): number[];
}

declare module "ethjs-query";
declare module "ethjs-contract";
declare module "ethjs-provider-http";
