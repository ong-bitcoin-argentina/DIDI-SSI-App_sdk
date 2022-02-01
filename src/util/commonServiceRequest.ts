import { string } from 'fp-ts';
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";

import { JSONObject } from "../util/JSON";

import { CommonServiceRequestError } from "./CommonServiceRequestError";

const log = console.log;

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const headers = {
	"Content-Type": "application/json; charset=utf-8"
};

const headersMultipart = {
	"Content-Type": "multipart/form-data"
}

function userApiWrapperCodec<M extends t.Mixed>(data: M) {
	return t.union([
		t.type({
			status: t.literal("success"),
			data
		}),
		t.type({
			status: t.literal("error"),
			errorCode: t.string,
			message: t.string
		})
	]);
}

export async function commonServiceRequest<A>(
	method: HTTPMethod,
	url: string,
	dataDecoder: t.Type<A>,
	parameters: JSONObject,
	asFormData: Boolean = false
): Promise<Either<CommonServiceRequestError, A>> {
	let response: Response;
	try {

		if (asFormData){
			const formData = new FormData();
	
			for (const key in parameters) {
				formData.append(key, parameters[key])
			}
			response = await fetch(url, {
				method,
				headers: headersMultipart,
				body: formData
			});

		}else{
			response = await fetch(url, {
				method,
				headers,
				...(method !== "GET" && { body: JSON.stringify(parameters) })
			});
		}
	} catch (error) {
		log(error);
		return left({ type: "FETCH_ERROR", error });
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch (error) {
		log(error);
		return left({ type: "JSON_ERROR", error });
	}

	const decoded = userApiWrapperCodec(dataDecoder).decode(body);
	if (isLeft(decoded)) {
		log(decoded.left);
		return left({ type: "DECODE_ERROR", error: decoded.left });
	} else if (decoded.right.status === "error") {
		log(decoded.right);
		return left({
			type: "SERVER_ERROR",
			error: {
				errorCode: decoded.right.errorCode,
				message: decoded.right.message
			}
		});
	} else {
		const data = decoded.right.data ? decoded.right.data : decoded.right
		// @ts-ignore
		return right(data);
	}
}

export const simpleCall = async (url: string, method: HTTPMethod = "GET", data: any, responseIsText: Boolean = false) => {
	const options = {
		headers,
		method,
		...(method !== "GET" && { body: JSON.stringify(data) })
	};
	const res = await fetch(url, options);

	if (responseIsText){
		return res.text();
	}
	
	const content = await res.json();
	if (res.ok) {
		return content;
	}
	throw new Error(content.message);
};

export const authorizationCall = async (url: string, method: HTTPMethod = "GET", data: any, token: string, responseIsText: Boolean = false) => {
	const options = {
		headers:{
			"Content-Type": "application/json",
	        "Authorization": `Bearer ${token}`,
		},
		method,
		...(method !== "GET" && { body: JSON.stringify(data) })
	};
	const res = await fetch(url, options);

	if (responseIsText){
		return res.text();
	}
	
	const content = await res.json();
	if (res.ok) {
		return content;
	}
	throw new Error(content.message);
};