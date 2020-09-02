import * as t from "io-ts";

export interface Prestador {
	id: number;
	name: string;
	benefit?: number;
	email: string;
	category?: string;
	speciality?: string;
	phone?: string;
	whatsappNumber?: string;
}

export interface ShareDataRequest {
	dni: number;
	did: string;
	email: string;
	phone: string;
	providerId?: number;
	customProviderEmail?: string;
	viewerJWT: string;
}

export type SemillasNeedsToValidateDni = {
	dni: string;
	email: string;
	phone: string;
	name: string;
	lastName: string;
};

export const messageResponse = t.type({
	message: t.string
});

export const dataResponse = t.type({
	data: t.string
});
