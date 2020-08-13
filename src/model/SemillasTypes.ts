import * as t from "io-ts";

export interface Prestador {
	id: number;
	benefit: string;
	category: string;
	name: string;
	speciality: string | null;
	phone: string;
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
