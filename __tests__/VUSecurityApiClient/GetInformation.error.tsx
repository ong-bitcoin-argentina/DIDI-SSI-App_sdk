require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";
//config
import { URI_VU_SECURITY, TOKEN } from "../config/config.test.json";

//request
import addFieldUserNameMandatory from "./request/getInformation/addFieldUserNameMandatory.json";
import addFieldOperationIdMandatory from "./request/addFinishOperationError/addFieldOperationIdMandatory.json";

//response
import addUserNameMandatoryResponse from "./response/getInformation/addUserNameMandatoryResponse.json";
import addOperationIdMandatoryResponse from "./response/cancelVerification/addOperationIdMandatoryResponse.json";

describe("getInformation", () => {
	it(`Should THROW ERROR when you want to enter a userName with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addUserNameMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.getInformation(
			addFieldUserNameMandatory.userName,
			addFieldUserNameMandatory.operationId,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(fetch).toHaveBeenCalledTimes(0);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a operationId with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(Error(addOperationIdMandatoryResponse.message)));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		try {
		    await vuScurity.getInformation(
				addFieldOperationIdMandatory.userName,
				addFieldOperationIdMandatory.operationId,
				TOKEN
			)
		} catch (error) {
			expect(error).toEqual(await fetch());
		}
		done();	
	}, 5000);
});
