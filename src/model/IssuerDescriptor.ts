import { EthrDID } from "./EthrDID";

export interface IssuerDescriptor {
	did: EthrDID;
	name: string | null;
	description?: string;
	imageUrl?: string;
}
