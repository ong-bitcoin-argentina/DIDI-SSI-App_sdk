import EthContract from "ethjs-contract";
import HttpProvider from "ethjs-provider-http";
import Eth from "ethjs-query";
import DidRegistryContract from "ethr-did-registry";
import { delegateTypes, REGISTRY } from "ethr-did-resolver";

import { EthrDID } from "../../model/EthrDID";

export class DidRegistryClient {
	private didReg: any;

	constructor(ethrUri: string, registryAddress: string = REGISTRY) {
		const provider = new HttpProvider(ethrUri);
		const eth = new Eth(provider);
		const contract = new EthContract(eth)(DidRegistryContract.abi);
		this.didReg = contract.at(registryAddress);
	}

	async isValidDelegation(delegator: EthrDID, delegate: EthrDID): Promise<boolean> {
		type ValidDelegate = (identity: string, delegateType: string, delegate: string) => Promise<{ "0": boolean }>;
		const validDelegate: ValidDelegate = this.didReg.validDelegate;
		const res = await validDelegate(
			delegator.keyAddress(),
			delegateTypes.Secp256k1SignatureAuthentication2018,
			delegate.keyAddress()
		);
		return res["0"];
	}
}
