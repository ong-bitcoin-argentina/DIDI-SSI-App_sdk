import { DidiDocument } from "./DidiDocument";
import { DisclosureRequestDocuments } from "./DisclosureRequestDocuments";

export interface RequestDocument extends DisclosureRequestDocuments {
	type: "RequestDocument";
}
export const RequestDocument = DidiDocument;
