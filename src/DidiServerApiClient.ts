import { Either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import Credentials from "uport-credentials/lib/Credentials";

import { commonServiceRequest } from "./util/commonServiceRequest";
import { CommonServiceRequestError } from "./util/CommonServiceRequestError";

import { Encryption } from "./crypto/Encryption";
import { EthrDID } from "./model/EthrDID";
import { IssuerDescriptor } from "./model/IssuerDescriptor";
import { Prestador, dataResponse, dataMessageResponse } from "./model/SemillasTypes";

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

	issuerName: t.string,

	semillasPrestadores: t.array(
		t.type({
			id: t.number,
			benefit: t.string,
			category: t.string,
			name: t.string,
			speciality: t.string,
			phone: t.string
		})
	),

	dataResponse,
	dataMessageResponse
};

export type ValidateDniResponseData = typeof responseCodecs.validateDni._A;

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
		password: string
	): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/changeEmail`, responseCodecs.singleCertificate, {
			did: did.did(),
			eMailValidationCode: validationCode,
			newEMail: newEmail,
			password: await Encryption.hash(password)
		});
	}

	async changePassword(did: EthrDID, oldPassword: string, newPassword: string): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/changePassword`, responseCodecs.empty, {
			did: did.did(),
			oldPass: await Encryption.hash(oldPassword),
			newPass: await Encryption.hash(newPassword)
		});
	}

	async changePhoneNumber(
		did: EthrDID,
		validationCode: string,
		newPhoneNumber: string,
		password: string,
		firebaseId?: string
	): ApiResult<{ certificate: string }> {
		return commonServiceRequest("POST", `${this.baseUrl}/changePhoneNumber`, responseCodecs.singleCertificate, {
			did: did.did(),
			phoneValidationCode: validationCode,
			newPhoneNumber,
			password: await Encryption.hash(password),
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
				password: await Encryption.hash(password),
				...(firebaseId ? { firebaseId } : {})
			}
		);
		if (isLeft(response)) {
			return response;
		}

		try {
			const privateKeySeed = await Encryption.decrypt(response.right.privateKeySeed, privateKeyPassword);
			return right({ privateKeySeed });
		} catch (error) {
			return left({ type: "CRYPTO_ERROR", error });
		}
	}

	async recoverPassword(email: string, validationCode: string, newPassword: string): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/recoverPassword`, responseCodecs.empty, {
			eMail: email,
			eMailValidationCode: validationCode,
			newPass: await Encryption.hash(newPassword)
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
		},
		firebaseId?: string
	): ApiResult<{}> {
		try {
			const encryptedPrivateKeySeed = await Encryption.encrypt(userData.privateKeySeed, privateKeyPassword);
			return commonServiceRequest("POST", `${this.baseUrl}/registerUser`, responseCodecs.empty, {
				did: did.did(),
				eMail: userData.email,
				phoneNumber: userData.phoneNumber,
				password: await Encryption.hash(userData.password),
				privateKeySeed: encryptedPrivateKeySeed,
				...(firebaseId ? { firebaseId } : {})
			});
		} catch (error) {
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
		idCheck?: {
			did: EthrDID;
			password: string;
		}
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/sendSmsValidator`, responseCodecs.empty, {
			cellPhoneNumber,
			...(idCheck && {
				did: idCheck.did.did(),
				password: await Encryption.hash(idCheck.password)
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
		email: string,
		idCheck?: {
			did: EthrDID;
			password: string;
		}
	): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/sendMailValidator`, responseCodecs.empty, {
			eMail: email,
			...(idCheck && {
				did: idCheck.did.did(),
				password: await Encryption.hash(idCheck.password)
			})
		});
	}

	async userLogin(did: EthrDID, email: string, password: string, firebaseId?: string): ApiResult<{}> {
		return commonServiceRequest("POST", `${this.baseUrl}/userLogin`, responseCodecs.empty, {
			did: did.did(),
			eMail: email,
			password: await Encryption.hash(password),
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
			return right({ did: issuerDid, name: null });
		} else {
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
	 * Obtiene el listado de prestadores traidos desde semillas
	 */
	async shareData(email: string): ApiResult<{ data: string }> {
		const response = await commonServiceRequest("POST", `${this.baseUrl}/semillas/shareData`, dataResponse, {
			email
		});

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}

	/**
	 * Obtiene el listado de prestadores traidos desde semillas
	 */
	async semillasCredentialsRequest(did: EthrDID, dni: string): ApiResult<{ data: { message: string } }> {
		const response = await commonServiceRequest("POST", `${this.baseUrl}/semillas/credentials`, dataMessageResponse, {
			did: did.did(),
			dni: dni
		});

		if (isRight(response)) {
			return right(response.right);
		}
		return response;
	}
}
