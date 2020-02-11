import { EthrDID } from "./EthrDID";

export interface DidiDocument {
	/**
	 * JWT original del que se extrajo este documento
	 */
	jwt: string;

	/**
	 * Emisor de este documento
	 */
	issuer: EthrDID;

	/**
	 * Tiempo Unix de emision de este documento
	 */
	issuedAt?: number;

	/**
	 * Tiempo Unix hasta el que este documento es valido
	 */
	expireAt?: number;

	/**
	 * Entidad que delego la autoridad de emitir este documento al issuer
	 */
	delegator?: EthrDID;
}

export const DidiDocument = {
	/**
	 * Verifica si un documento es valido en una fecha especifica
	 */
	isValidAt: (document: DidiDocument, date: Date): boolean => {
		const timestamp = date.getTime() / 1000;
		if (document.expireAt && document.expireAt < timestamp) {
			return false;
		}
		if (document.issuedAt && timestamp < document.issuedAt) {
			return false;
		}
		return true;
	},

	/**
	 * Verifica si un documento es valido en el momento actual
	 */
	isValidNow: (document: DidiDocument): boolean => {
		return DidiDocument.isValidAt(document, new Date());
	},

	/**
	 * Indica que DID mostrar a un usuario como emisor de este documento
	 */
	displayedIssuer: (document: DidiDocument): EthrDID => {
		return document.delegator ?? document.issuer;
	}
};
