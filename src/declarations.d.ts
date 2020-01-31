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

	export function getResolver(conf: ResolverConfiguration): { ethr: DIDResolver };
}
