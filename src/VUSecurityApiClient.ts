import { authorizationCall } from "./util/commonServiceRequest";
import { IReturnFinishOperation } from './model/FinishOperation';
import { IVerification } from './model/CreateVerification';
import { ICancel } from './model/CancelVerification';
import { IDocumentImage } from './model/DocumentImage';
import { IGetInformation } from './model/GetInformation';
import { ICheckValidateDni } from './model/CheckValidateDni';

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
type IReturnCheckValidateDni = IReturnError & ICheckValidateDni;
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
		return authorizationCall(`${this.baseUrl}/verifications`, "POST", {
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
		return authorizationCall(`${this.baseUrl}/verifications`, "DELETE", {
			userName,
			operationId
			},token);
	}



	async addDocumentImage(userName: string, operationId: string, side: string, file: string, token: string): Promise<IReturnImage>{	
		return authorizationCall(`${this.baseUrl}/verifications/${operationId}/documentImage`, "POST", {
			userName,
			side,
			file
		},token); 
    }

	async getInformation(userName: string, operationId: string, token: string): Promise<IReturnInformation>{
		return authorizationCall(`${this.baseUrl}/verifications/${operationId}/${userName}`, "GET",{},token);
	}

	async finishOperation(userName: string, operationId: string, token: string): Promise<IReturnFinish>{
		return authorizationCall(`${this.baseUrl}/verifications/${operationId}`, "PATCH", {
			userName
			},token);
	}

	async checkValidateDni(did: string, token: string): Promise<IReturnCheckValidateDni>{
		return authorizationCall(`${this.baseUrl}/verifications/${did}`, "GET",{},token);
	}
}
