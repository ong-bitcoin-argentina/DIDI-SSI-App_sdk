import * as t from "io-ts";

export interface Prestador {
	id: number;
	benefit: string;
	category: string;
	name: string;
	speciality: string;
	phone: string;
}

export const dataMessageResponse = t.type({
	data: t.type({
		message: t.string
	})
});

export const dataResponse = t.type({
	data: t.string
});
