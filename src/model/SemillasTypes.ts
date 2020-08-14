import * as t from "io-ts";

export interface Prestador {
	id: number;
	name: string;
	benefit: number;
	email: string;
	category?: string;
	speciality: string | null;
	phone: string;
	whatsappNumber: string;
}

export type SemillasNeedsToValidateDni = {
	dni: string;
	email: string;
	phoneNumber: string;
	name: string;
	lastname: string;
};

export const messageResponse = t.type({
	message: t.string
});

export const dataResponse = t.type({
	data: t.string
});
