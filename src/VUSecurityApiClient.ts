import { authorizationCall } from "./util/commonServiceRequest";
import { IReturnFinishOperation } from './model/FinishOperation';
import { IVerification } from './model/CreateVerification';
import { ICancel } from './model/CancelVerification';
import { IDocumentImage } from './model/DocumentImage';
import { IGetInformation } from './model/GetInformation';

interface IReturnError {
    status:    string;
    errorCode: string;
    message:   string;
}

type IReturn = IReturnError & IVerification ; 
type IReturnCancel = IReturnError & ICancel ; 
type IReturnImage = IReturnError & IDocumentImage;
type IReturnFinish = IReturnError & IReturnFinishOperation;
type IReturnInformation= IReturnError & IGetInformation;
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
		ipAddress: string,
		token: string
	): Promise<IReturn> {
		return authorizationCall(`${this.baseUrl}/verification`, "POST", {
			did,
			userName,
			deviceHash,
			rooted,
			operativeSystem,
			operativeSystemVersion,
			deviceManufacturer,
			deviceName,
			ipAddress
		},token);
	}

	async cancelVerification(userName: string, operationId: string, token: string): Promise<IReturnCancel>{
		return authorizationCall(`${this.baseUrl}/verification`, "DELETE", {
			userName,
			operationId
			},token);
	}



	async addDocumentImage(userName: string, operationId: string, side: string, file: string, token: string): Promise<IReturnImage>{	
		return authorizationCall(`${this.baseUrl}/${operationId}/documentImage`, "POST", {
			userName,
			side,
			file
		},token); 
    }

	async getInformation(userName: string, operationId: string, token: string): Promise<IReturnInformation>{
		return authorizationCall(`${this.baseUrl}/verification/${operationId}/${userName}`, "GET",{},token);
	}

	async finishOperation(userName: string, operationId: string, token: string): Promise<IReturnFinish>{
		return authorizationCall(`${this.baseUrl}/verification/${operationId}`, "PATCH", {
			userName
			},token);
	}

}
