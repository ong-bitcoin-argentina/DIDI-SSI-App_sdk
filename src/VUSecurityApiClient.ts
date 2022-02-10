import { authorizationCall, simpleCall } from "./util/commonServiceRequest";
import { ApiResult } from "./DidiServerApiClient";
import { ICreateVerificationResponse } from './model/VuSecurity';
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

	async createVerification(
		did: string,
		userName: string,
		deviceHash: string,
		rooted: boolean,
		operativeSystem: string,
		operativeSystemVersion: string,
		deviceManufacturer: string,
		deviceName: string,
		token: string
	): ApiResult<ICreateVerificationResponse> {
		return authorizationCall(`${this.baseUrl}/createVerification`, "POST", {
			did,
			userName,
			deviceHash,
			rooted,
			operativeSystem,
			operativeSystemVersion,
			deviceManufacturer,
			deviceName
		},token);
	}

	async cancelVerification(userName: string, operationId: string, token: string): ApiResult<string> {
		return authorizationCall(`${this.baseUrl}/cancelVerification`, "POST", {
			userName,
			operationId
		},token); 
	}



	async addDocumentImage(userName: string, operationId: string, side: string, file: string, token: string): ApiResult<string> {	
		return authorizationCall(`${this.baseUrl}/addDocumentImage`, "POST", {
			operationId,
			userName,
			side,
			file
		},token); 
    }

}
