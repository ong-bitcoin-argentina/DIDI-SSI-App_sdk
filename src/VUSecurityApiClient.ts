import { authorizationCall } from "./util/commonServiceRequest";
import { IReturnFinishOperation } from './model/FinishOperation';
import { IVerification } from './model/CreateVerification';
import { ICancel } from './model/CancelVerification';
import { IDocumentImage } from './model/DocumentImage';

interface IReturnError {
    status:    string;
    errorCode: string;
    message:   string;
}

type IReturn = IReturnError & IVerification ; 
type IReturnCancel = IReturnError & ICancel ; 
type IReturnImage = IReturnError & IDocumentImage;
type IReturnFinish = IReturnError & IReturnFinishOperation;
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
	): Promise<IReturn> {
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

	async cancelVerification(userName: string, operationId: string, token: string): Promise<IReturnCancel>{
		return authorizationCall(`${this.baseUrl}/cancelVerification`, "POST", {
			userName,
			operationId
			},token);
	}



	async addDocumentImage(userName: string, operationId: string, side: string, file: string, token: string): Promise<IReturnImage>{	
		return authorizationCall(`${this.baseUrl}/addDocumentImage`, "POST", {
			operationId,
			userName,
			side,
			file
		},token); 
    }


	async finishOperation(userName: string, operationId: string, token: string): Promise<IReturnFinish>{
		return authorizationCall(`${this.baseUrl}/finishOperation`, "POST", {
			operationId,
			userName
			},token);
	}

	

}
