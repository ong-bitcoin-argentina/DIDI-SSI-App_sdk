import TypedArray from "../util/TypedArray";

import { ClaimData, ClaimDataPairs } from "./Claim";
import { DidiDocument } from "./DidiDocument";
import { EthrDID } from "./EthrDID";
import { SpecialCredentialFlag } from "./SpecialCredential";

/**
 * Categoria de una credencial
 */
export type DocumentFilterType = "education" | "livingPlace" | "finance" | "identity" | "benefit" | "work";

/**
 * Representa la estructura de la credencial (como se mostrará en la aplicación)
 */
export interface DocumentLayout {
	rows: {
		columns: number;
	}[];
	backgroundImage: string;
}

/**
 * Una credencial didi es una descripcion de un sujeto, creada y firmada por un emisor.
 */
export interface CredentialDocument extends DidiDocument {
	type: "CredentialDocument";

	/** Sujeto descripto por esta credencial */
	subject: EthrDID;

	/**
	 * Titulo de la credencial.
	 *
	 * Tambien usado para identificarlas en flujos de compartir (ver SelectiveDisclosureRequest)
	 */
	title: string;

	/** Pares clave/valor que describen al sujeto */
	data: ClaimData;

	/** Estilo de la vista previa a mostrar */
	preview?: {
		/** Numero del estilo de vista previa */
		type: number;
		/** Campos a mostrar */
		fields: string[];
		cardLayout?: DocumentLayout;
	};

	/** Categoria en que se clasifica esta credencial */
	category?: DocumentFilterType;

	/** Microcredenciales anidadas dentro de esta credencial */
	nested: CredentialDocument[];

	/**
	 * Indicador que esta credencial contiene datos referentes a la
	 * identidad del sujeto
	 */
	specialFlag?: SpecialCredentialFlag;
}

export const CredentialDocument = {
	...DidiDocument,

	/**
	 * Obtiene todos los pares clave/valor anidados en una credencial
	 */
	extractAllDataPairs: (doc: CredentialDocument): ClaimDataPairs => {
		return [
			...doc.nested.map(CredentialDocument.extractAllDataPairs).reduce((l, r) => [...l, ...r], []),
			...Object.entries(doc.data).map(([label, value]) => ({ label, value }))
		];
	},

	/**
	 * Obtiene los pares clave/valor a mostrar en la vista previa de una credencial
	 */
	extractPreviewDataPairs: (doc: CredentialDocument): ClaimDataPairs => {
		const dataPairs = CredentialDocument.extractAllDataPairs(doc);
		if (!doc.preview) {
			return dataPairs;
		}

		return TypedArray.flatMap(doc.preview.fields, label => dataPairs.find(pair => pair.label === label));
	},

	/**
	 * Cantidad de columnas en las que mostrar la vista previa de un documento
	 */
	numberOfColumns(doc: CredentialDocument): 1 | 2 | 3 {
		if (!doc.preview) {
			return 1;
		}
		switch (doc.preview.type) {
			case 1:
			case 2:
			case 3:
				return doc.preview.type;
			default:
				return 1;
		}
	}
};
