import * as t from "io-ts";

import { ErrorData } from "../util/ErrorData";

/**
 * Errores comunes a los metodos de DidiServerApiClient
 */
export type CommonServiceRequestError =
	| { type: "FETCH_ERROR"; error: any }
	| { type: "JSON_ERROR"; error: any }
	| { type: "DECODE_ERROR"; error: t.Errors }
	| { type: "SERVER_ERROR"; error: ErrorData }
	| { type: "CRYPTO_ERROR"; error: any };
