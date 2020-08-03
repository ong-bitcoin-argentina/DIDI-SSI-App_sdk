import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";

import { JSONObject } from "../util/JSON";

import { CommonServiceRequestError } from "./CommonServiceRequestError";

const log = console.log;

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const headers = {
	"Content-Type": "application/json; charset=utf-8"
};

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
	parameters: JSONObject
): Promise<Either<CommonServiceRequestError, A>> {
	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers,
			...(method !== "GET" && { body: JSON.stringify(parameters) })
		});
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
		return right(decoded.right.data);
	}
}

export const simpleCall = (url: string, method: HTTPMethod = "GET", data: any) => {
	const options = {
		headers,
		method,
		...(data && { body: JSON.stringify(data) })
	};
	return new Promise((resolve, reject) => {
		fetch(url, options).then(res => {
			return res.ok ? res.json() : reject(res);
		});
	});
};
