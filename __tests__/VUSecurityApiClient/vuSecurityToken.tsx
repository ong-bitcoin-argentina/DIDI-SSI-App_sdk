require("isomorphic-fetch");
jest.mock("node-fetch");
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";

import { URI_VU_SECURITY, TOKEN_EMPTY, TOKEN_INCORRECT } from "./request/config.test.json";
import cancelVerification from "./request/cancelVerification.json";

describe("cancelVerification", () => {
	it(`Should THROW ERROR when you want to enter a Token with space "" `, async done => {
		try {
			const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
			await vuScurity.cancelVerification(cancelVerification.userName, cancelVerification.operationId, TOKEN_EMPTY);
		} catch (error) {
			expect(error).toEqual(Error("invalid_argument: no JWT passed into decodeJWT"));
            done();	
		}
	}, 5000);

	it(`Should THROW ERROR when you want to enter a Token Incorrect `, async done => {
		try {
			const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
			await vuScurity.cancelVerification(cancelVerification.userName, cancelVerification.operationId, TOKEN_INCORRECT);
		} catch (error) {
			expect(error).toEqual(Error("invalid_argument: Incorrect format JWT"));
            done();	
		}
	}, 5000);
});
