import { IShareResp } from './model/ShareResponse';
import { authorizationToken } from './util/commonServiceRequest';

export class IssuerApiClient {

	private baseUrl: string;

	/**
	 *
	 * @param baseUrl URI de la conexion con issuer-module-backend
	 * @example "http://api.identity.example.com/"
	 */
	constructor(_baseUrl: string) {
		this.baseUrl = _baseUrl;
	}
	
	/**
	* enviar los shareResponse
	*/
	async shareResponse(did: string, jwt: string, token : string): Promise<IShareResp>{ 
		return authorizationToken(`${this.baseUrl}/shareResponse/${did}`,"POST",{
			jwt,
			},
			token
		);
	}

}
