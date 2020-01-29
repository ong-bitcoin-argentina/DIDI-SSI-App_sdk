type ClaimValue = string | number | null;

export interface ClaimData {
	[key: string]: ClaimValue;
}

export type ClaimDataPairs = Array<{ label: string; value: ClaimValue }>;
