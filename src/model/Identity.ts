export interface PersonalIdentityData {
	firstNames: string;
	lastNames: string;
	document: string;
	nationality: string;
}

export interface LegalAddress {
	street: string;
	number: string;
	department: string;
	floor: string;
	neighborhood: string;
	postCode: string;
}

export interface Identity {
	image?: {
		mimetype: string;
		data: string;
	};
	cellPhone?: string;
	email?: string;
	personalData: Partial<PersonalIdentityData>;
	address: Partial<LegalAddress>;
}

export const Identity = {
	merge(preferred: Partial<Identity>, fallback: Identity): Identity {
		return {
			...fallback,
			...preferred,
			address: {
				...fallback.address,
				...preferred.address
			},
			personalData: {
				...fallback.personalData,
				...preferred.personalData
			}
		};
	}
};
