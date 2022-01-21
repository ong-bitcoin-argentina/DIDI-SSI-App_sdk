import * as t from "io-ts";
import { simpleCall } from './util/commonServiceRequest';
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
		return simpleCall(`${this.baseUrl}/registerUser`, 'POST',{
			did,
			name,
			lastname
	});
	}


    async createVerification(
        did: string,
		userName: string,
		deviceHash: string,
		rooted: boolean,
		operativeSystem: string,
		operativeSystemVersion: string,
		deviceManufacturer: string,
		deviceName: string
        ):  ApiResult<string>{
			return simpleCall(`${this.baseUrl}/createVerification`, 'POST',{
                did,
				userName,
				deviceHash,
				rooted,
				operativeSystem,
				operativeSystemVersion,
				deviceManufacturer,
				deviceName,
           })
    }
};
