type ClaimValue = string | number | null;

/**
 * Pares clave/valor contenidos en una credencial, sin orden.
 * @see ClaimDataPairs
 */
export interface ClaimData {
	[key: string]: ClaimValue;
}

/**
 * Pares clave/valor contenidos en una credencial, ordenados.
 * @see ClaimData
 */
export type ClaimDataPairs = Array<{ label: string; value: ClaimValue }>;
