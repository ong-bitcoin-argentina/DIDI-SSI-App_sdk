
import { IShareResp } from './model/DniIdnetity';
import { authorizationCall } from './util/commonServiceRequest';

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
		return authorizationCall(`${this.baseUrl}/dni-identity`,"POST",{
			credential: jwt,
			},
			"token",
		);
	}

}
