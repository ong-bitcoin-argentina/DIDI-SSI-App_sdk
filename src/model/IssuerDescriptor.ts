import { EthrDID } from "./EthrDID";

export interface IssuerDescriptor {
	did: EthrDID;
	name: string | null;
	description?: string;
	imageUrl?: string;
	expireOn?: Date;
	shareRequests?:string[]; 
}

export interface IssuersDescriptor {
	issuersList: IssuerDescriptor[];
	totalPages: number;
}
