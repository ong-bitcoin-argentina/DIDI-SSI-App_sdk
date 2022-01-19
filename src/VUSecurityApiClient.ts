import * as t from "io-ts";
import { commonServiceRequest } from "./util/commonServiceRequest";
import { ApiResult } from './DidiServerApiClient';

const responseCodecs = {
	empty: t.type({}),
	string: t.string
};

export class VUSecurityApiClient {

	private baseUrl: string;	
	
	/**
	 * 
	 * @param baseUrl URI de la instancia de didi-ssi-identity-issuer a usar
	 * @example "http://api.identity.example.com/"
	 */
	constructor(_baseUrl: string) {
		this.baseUrl = _baseUrl;
	}

	async registerUser(did: string, name: string, lastname: string):  ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/registerUser`, responseCodecs.empty, {
				did,
				name,
				lastname
		});
	}

    async createVerification(
        did: string,
		userName: string,
		ipAddress: string,
		deviceHash: string,
		rooted: boolean,
		applicationVersion: string,
		operativeSystem: string,
		operativeSystemVersion: string,
		deviceManufacturer: string,
		deviceName: string
        ):  ApiResult<string>{
            return commonServiceRequest("POST", `${this.baseUrl}/createVerification`, responseCodecs.string,{
                did,
				userName,
				ipAddress,
				deviceHash,
				rooted,
				applicationVersion,
				operativeSystem,
				operativeSystemVersion,
				deviceManufacturer,
				deviceName,
           });
    }
};
