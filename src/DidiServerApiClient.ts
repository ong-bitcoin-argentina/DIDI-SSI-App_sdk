import { Either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import Credentials from "uport-credentials/lib/Credentials";

import { commonServiceRequest, simpleCall } from "./util/commonServiceRequest";
import { CommonServiceRequestError } from "./util/CommonServiceRequestError";

import { Encryption } from "./crypto/Encryption";
import { EthrDID } from "./model/EthrDID";
import { IssuerDescriptor } from "./model/IssuerDescriptor";
import {
	Prestador,
	dataResponse,
	messageResponse,
	SemillasNeedsToValidateDni,
	ShareDataRequest
} from "./model/SemillasTypes";

const log = console.log;

/**
 * Configuracion de DidiServerApiClient
 */
export interface DidiServerApiClientConfiguration {
	/**
	 * URI de la instancia de didi-server a usar
	 * @example "http://didi.example.com/api/1.0/didi"
	 */
	didiServerUri: string;
}

const responseCodecs = {
	empty: t.type({}),

	singleCertificate: t.type({
		certificate: t.string
	}),

	accountRecovery: t.type({
		privateKeySeed: t.string
	}),

	validateDni: t.union([
		t.type({ operationId: t.string, status: t.literal("In Progress") }),
		t.type({ operationId: t.string, status: t.literal("Successful") }),
		t.intersection([
			t.type({ operationId: t.string, status: t.literal("Falied") }),
			t.partial({ errorMessage: t.string })
		])
	]),

	validateDniWithSemillas: t.string,
	personalData: t.any,
	profileImage: t.any,
	presentation: t.any,
	issuerName: t.string,

	semillasPrestadores: t.array(t.any),
	semillasIdentityValidation: t.any,
	saveShareRequest: t.any,

	dataResponse,
	messageResponse
};

export type ValidateDniResponseData = typeof responseCodecs.validateDni._A;
export type ValidateDniWithSemillasResponseData = typeof responseCodecs.validateDniWithSemillas._A;
export type SemillasIdentityValidation = typeof responseCodecs.semillasIdentityValidation._A;
export type PersonalDataResponseData = typeof responseCodecs.personalData._A;

export type ApiResult<T> = Promise<Either<CommonServiceRequestError, T>>;

/**
 * Cliente del servidor didi-server, el cual contiene la base de datos de
 * usuarios, emite credenciales relacionadas y contiene el registro de emisores
 * conocidos.
 */
export class DidiServerApiClient {
	private baseUrl: string;

	constructor(config: DidiServerApiClientConfiguration) {
		this.baseUrl = config.didiServerUri;
	}

	async changeEmail(
		did: EthrDID,
		validationCode: string,
		newEmail: string,
		password: string,
		privateKeyPassword: string
	): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/changeEmail`, responseCodecs.singleCertificate, {
			did: did.did(),
			eMailValidationCode: validationCode,
			newEMail: newEmail,
			password: await Encryption.hash(password, privateKeyPassword)
		});
	}

	async changePassword(
		did: EthrDID, 
		oldPassword: string, 
		newPassword: string,
		privateKeyPassword: string,
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/changePassword`, responseCodecs.empty, {
			did: did.did(),
			oldPass: await Encryption.hash(oldPassword, privateKeyPassword),
			newPass: await Encryption.hash(newPassword, privateKeyPassword)
		});
	}

	async changePhoneNumber(
		did: EthrDID,
		validationCode: string,
		newPhoneNumber: string,
		password: string,
		privateKeyPassword: string,
		firebaseId?: string
	): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/changePhoneNumber`, responseCodecs.singleCertificate, {
			did: did.did(),
			phoneValidationCode: validationCode,
			newPhoneNumber,
			password: await Encryption.hash(password, privateKeyPassword),
			...(firebaseId ? { firebaseId } : {})
		});
	}

	async checkValidateDni(did: EthrDID, operationId: string): ApiResult<ValidateDniResponseData> {
		return commonServiceRequest("POST", `${this.baseUrl}/renaper/validateDniState`, responseCodecs.validateDni, {
			did: did.did(),
			operationId
		});
	}

	async recoverAccount(
		email: string,
		password: string,
		privateKeyPassword: string,
		firebaseId?: string
	): ApiResult<{ privateKeySeed: string }> {
		const response = await commonServiceRequest(
			"POST",
			`${this.baseUrl}/recoverAccount`,
			responseCodecs.accountRecovery,
			{
				eMail: email,
				password: await Encryption.hash(password, privateKeyPassword),
				...(firebaseId ? { firebaseId } : {})
			}
		);
		if (isLeft(response)) {
			log(response.left);
			return response;
		}

		try {
			const privateKeySeed = await Encryption.decrypt(response.right.privateKeySeed, privateKeyPassword);
			return right({ privateKeySeed });
		} catch (error) {
			log(error);
			return left({ type: "CRYPTO_ERROR", error });
		}
	}

	async recoverPassword(
		email: string, 
		validationCode: string, 
		newPassword: string,
		privateKeyPassword: string
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/recoverPassword`, responseCodecs.empty, {
			eMail: email,
			eMailValidationCode: validationCode,
			newPass: await Encryption.hash(newPassword, privateKeyPassword)
		});
	}

	async registerUser(
		did: EthrDID,
		privateKeyPassword: string,
		userData: {
			email: string;
			phoneNumber: string;
			password: string;
			privateKeySeed: string;
			name: string;
			lastname: string;
		},
		firebaseId?: string
	): ApiResult<{}> {
		try {
			const encryptedPrivateKeySeed = await Encryption.encrypt(userData.privateKeySeed, privateKeyPassword);
			return commonServiceRequest("POST", `${this.baseUrl}/registerUser`, responseCodecs.empty, {
				did: did.did(),
				eMail: userData.email,
				phoneNumber: userData.phoneNumber,
				password: await Encryption.hash(userData.password, privateKeyPassword),
				privateKeySeed: encryptedPrivateKeySeed,
				name: userData.name,
				lastname: userData.lastname,
				...(firebaseId ? { firebaseId } : {})
			});
		} catch (error) {
			log(error);
			return left({ type: "CRYPTO_ERROR", error });
		}
	}

	/**
	 * Envia un codigo de validacion a un numero de telefono
	 * @param cellPhoneNumber
	 * Un numero de telefono con codigo de pais y sin codigo de discado internacional
	 * @param idCheck
	 * Si se desea verificar que cellPhoneNumber esté asociado a un DID, el DID y password correspondiente
	 * @example
	 * apiClient.sendSmsValidator("+541100000000", {
	 * 	did: EthrDID.fromKeyAddress("0x0000000000000000000000000000000000000000"),
	 * 	password: "00000000"
	 * })
	 */
	async sendSmsValidator(
		cellPhoneNumber: string,
		privateKeyPassword: string,
		idCheck?: {
			did: EthrDID;
			password: string;
		},
		unique: boolean = true
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/sendSmsValidator`, responseCodecs.empty, {
			cellPhoneNumber,
			unique,
			...(idCheck && {
				did: idCheck.did.did(),
				password: await Encryption.hash(idCheck.password, privateKeyPassword)
			})
		});
	}

	/**
	 * Envia un codigo de validacion a un email
	 * @param email
	 * @param idCheck
	 * Si se desea verificar que el email esté asociado a un DID, el DID y password correspondiente
	 * @example
	 * apiClient.sendEmailValidator("existing_user@example.com", {
	 * 	did: EthrDID.fromKeyAddress("0x0000000000000000000000000000000000000000"),
	 * 	password: "00000000"
	 * })
	 */
	async sendMailValidator(
		eMail: string,
		privateKeyPassword: string,
		idCheck?: {
			did: EthrDID;
			password: string;
		},
		unique: boolean = false,
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/sendMailValidator`, responseCodecs.empty, {
			eMail,
			unique,
			...(idCheck && {
				did: idCheck.did.did(),
				password: await Encryption.hash(idCheck.password, privateKeyPassword)
			})
		});
	}

	async userLogin(
		did: EthrDID, 
		email: string, 
		password: string, 
		privateKeyPassword: string,
		firebaseId?: string
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/userLogin`, responseCodecs.empty, {
			did: did.did(),
			eMail: email,
			password: await Encryption.hash(password, privateKeyPassword),
			...(firebaseId ? { firebaseId } : {})
		});
	}

	async renewFirebaseToken(credentials: Credentials, firebaseId: string): ApiResult<{}> {
		const token = await credentials.signJWT({ firebaseId }, 100);
		return commonServiceRequest("POST", `${this.baseUrl}/renewFirebaseToken`, responseCodecs.empty, {
			token
		});
	}

	/**
	 * @param did
	 * DID del usuario a asociar a este DNI
	 * @param data
	 * Datos extraidos del PDF417/MRZ del documento
	 * @param pictures
	 * Imagenes del documento y la persona que se validan. Verificar con
	 * backend/ReNaPer que aceptan, actualmente formato JPG, sin rotacion
	 * EXIF, encodeadas base64
	 * @param pictures.front
	 * Imagen del frente del documento
	 * @param pictures.back
	 * Imagen del reverso del documento
	 * @param pictures.selfie
	 * Imagen de la persona
	 */
	async validateDni(
		did: EthrDID,
		data: {
			dni: string;
			gender: string;
			firstName: string;
			lastName: string;
			birthDate: string;
			order: string;
		},
		pictures: {
			front: string;
			back: string;
			selfie: string;
		}
	): ApiResult<ValidateDniResponseData> {
		return commonServiceRequest("POST", `${this.baseUrl}/renaper/validateDni`, responseCodecs.validateDni, {
			did: did.did(),
			dni: data.dni,
			gender: data.gender,
			name: data.firstName,
			lastName: data.lastName,
			birthDate: data.birthDate,
			order: data.order,
			selfieImage: pictures.selfie,
			frontImage: pictures.front,
			backImage: pictures.back
		});
	}

	async verifyEmailCode(did: EthrDID, validationCode: string, email: string): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/verifyMailCode`, responseCodecs.singleCertificate, {
			did: did.did(),
			validationCode,
			eMail: email
		});
	}

	async verifySmsCode(did: EthrDID, validationCode: string, phoneNumber: string): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/verifySmsCode`, responseCodecs.singleCertificate, {
			did: did.did(),
			validationCode,
			cellPhoneNumber: phoneNumber
		});
	}

	/**
	 * Obtiene datos registrados sobre un emisor de credenciales
	 * @param issuerDid
	 * El DID del emisor a consultar
	 */
	async getIssuerData(issuerDid: EthrDID): ApiResult<IssuerDescriptor> {
		const response = await commonServiceRequest(
			"GET",
			`${this.baseUrl}/issuer/${issuerDid.did()}`,
			responseCodecs.issuerName,
			{}
		);

		// Distinguish between failure and a successfully received absence of a name
		if (isRight(response)) {
			return right({ did: issuerDid, name: response.right });
		} else if (response.left.type === "SERVER_ERROR" && response.left.error.errorCode === "IS_INVALID") {
			log(response.left);
			return right({ did: issuerDid, name: null });
		} else {
			log(response);
			return response;
		}
	}

	/**
	 * Obtiene el listado de prestadores traidos desde semillas
	 */
	async getPrestadores(): ApiResult<{ data: Prestador[] }> {
		const response = await commonServiceRequest(
			"GET",
			`${this.baseUrl}/semillas/prestadores`,
			responseCodecs.semillasPrestadores,
			{}
		);

		if (isRight(response)) {
			return right({ data: response.right });
		}
		return response;
	}

	/**
	 * Comparte datos de titular/familiar para solicitar un prestador
	 */
	shareData(data: ShareDataRequest) {
		return simpleCall(`${this.baseUrl}/semillas/credentialShare`, "POST", data);
	}

	/**
	 * Solicita las credenciales de semillas
	 */
	async semillasCredentialsRequest(did: EthrDID, dni: string): ApiResult<{ message: string }> {
		const response = await commonServiceRequest("POST", `${this.baseUrl}/semillas/notifyDniDid`, messageResponse, {
			did: did.did(),
			dni: dni
		});

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	/**
	 * @param did
	 * DID del usuario a asociar a este DNI
	 * @param data
	 */
	async validateDniWithSemillas(
		did: EthrDID,
		data: SemillasNeedsToValidateDni
	): ApiResult<ValidateDniWithSemillasResponseData> {
		const response = await commonServiceRequest(
			"POST",
			`${this.baseUrl}/semillas/validateDni`,
			responseCodecs.validateDniWithSemillas,
			{
				did: did.did(),
				...data
			}
		);

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	/**
	 * @param did
	 */
	async getSemillasValidation(did: EthrDID): ApiResult<SemillasIdentityValidation> {
		const response = await commonServiceRequest(
			"GET",
			`${this.baseUrl}/semillas/identityValidation/${did.did()}`,
			responseCodecs.semillasIdentityValidation,
			{}
		);
		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	/**
	 * @param did
	 * DID del usuario a buscar
	 */
	async getPersonalData(did: EthrDID, userJWT: string): ApiResult<PersonalDataResponseData> {
		const response = await commonServiceRequest(
			"GET",
			`${this.baseUrl}/user/${did.did()}`,
			responseCodecs.personalData,
			{ userJWT }
		);

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	async sendPersonalData(
		did: EthrDID,
		name: string,
		lastname: string,
		userJWT: string
	): ApiResult<PersonalDataResponseData> {
		const response = await commonServiceRequest(
			"POST",
			`${this.baseUrl}/user/${did.did()}/edit`,
			responseCodecs.personalData,
			{ userJWT, name, lastname }
		);

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	async sendProfileImage(did: EthrDID, file: any, userJWT: string): ApiResult<PersonalDataResponseData> {
		const response = await commonServiceRequest(
			"POST",
			`${this.baseUrl}/user/${did.did()}/image`,
			responseCodecs.profileImage,
			{ userJWT: userJWT, file: file },
			true
		);

		return response;
	}

	async userHasRondaAccount(did: EthrDID): ApiResult<any> {
		const response = await simpleCall(`${this.baseUrl}/userApp/${did.did()}`, "GET", null);
		if (isRight(response)) {
			return right(response);
		}
		return response;
	}

	async savePresentation(jwts: any): ApiResult<any> {
		const response = await commonServiceRequest("POST", `${this.baseUrl}/presentation`, responseCodecs.presentation, {
			jwts
		});

		if (isRight(response)) {
			return right(response);
		}
		return response;
	}

	/**
	 * @param sharingJWT
	 * JWT de las credenciales del usuario que "quiere compartir"
	 */
	async saveShareRequest(userJWT: string, sharingJWT: string): ApiResult<any> {
		return await simpleCall(`${this.baseUrl}/shareRequest`, "POST", { userJWT, jwt: sharingJWT });
	}

	async getShareRequestFromServer(token: string, idShareRequest: string): ApiResult<any> {
		const response = await simpleCall(
			`${this.baseUrl}/shareRequest/${idShareRequest}`,
			"POST",
			{ userJWT: token },
			true
		);

		return response;
	}
}
