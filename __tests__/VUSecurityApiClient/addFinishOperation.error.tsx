require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";
//config
import { URI_VU_SECURITY, TOKEN } from "../config/config.test.json";

//request
import addFieldUserNameMandatory from "./request/addFinishOperationError/addFieldUserNameMandatory.json";
import addFieldOperationIdMandatory from "./request/addFinishOperationError/addFieldOperationIdMandatory.json";

//response
import addUserNameMandatoryResponse from "./response/addFinishOperationError/addUserNameMandatoryResponse.json";
import addOperationIdMandatoryResponse from "./response/cancelVerification/addOperationIdMandatoryResponse.json";

describe("finishOperation", () => {
	it(`Should THROW ERROR when you want to enter a userName with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addUserNameMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.finishOperation(
			addFieldUserNameMandatory.userName,
			addFieldUserNameMandatory.operationId,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(1);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a operationId with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addOperationIdMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		try {
			const result =	await vuScurity.finishOperation(
				addFieldOperationIdMandatory.userName,
				addFieldOperationIdMandatory.operationId,
				TOKEN
			);
		} catch (error) {
			expect(error).toEqual(Error((await fetch()).message));
		}
		done();
	}, 5000);
});
