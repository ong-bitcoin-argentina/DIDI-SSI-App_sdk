import { DidiDocument } from "./DidiDocument";
import { DisclosureRequestDocuments } from "./DisclosureRequestDocuments";

export interface ProposalDocument extends DisclosureRequestDocuments {
	type: "ProposalDocument";
}
export const ProposalDocument = DidiDocument;
