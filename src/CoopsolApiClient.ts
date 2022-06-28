
import { IShareResp } from './model/DniIdnetity';
import { authorizationToken } from './util/commonServiceRequest';

export class CoopsolApiClient {

	private baseUrl: string;

	/**
	 *
	 * @param baseUrl URI de la conexion con issuer-module-backend
	 * @example "https://www.coopsol.com.ar"
	 */
	constructor(_baseUrl: string) {
		this.baseUrl = _baseUrl;
	}
	
	/**
	* enviar los Identidad validada
	*/
	async dniIdentity(jwt: string): Promise<IShareResp>{ 
		return authorizationToken(`${this.baseUrl}/dni-identity`,"POST",{
			credential: jwt,
			},
			"",
		);
	}

}
