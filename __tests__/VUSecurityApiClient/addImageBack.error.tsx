require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";
//config
import { URI_VU_SECURITY, TOKEN } from "../config/config.test.json";
import base64Img from "../config/image/file.json";
//request
import addFieldUserNameMandatory from "./request/addImageBackError/addFieldUserNameMandatory.json";
import addFieldOperationIdMandatory from "./request/addImageBackError/addFieldOperationIdMandatory.json";
import addFielSideMandatory from "./request/addImageBackError/addFielSideMandatory.json";

//response
import addUserNameMandatoryResponse from "./response/addImageBackError/addUserNameMandatoryResponse.json";
import addOperationIdMandatoryResponse from "./response/addImageBackError/addOperationIdMandatoryResponse.json";
import addSideMandatoryResponse from "./response/addImageBackError/addSideMandatoryResponse.json";

describe("addImageFront", () => {
	it(`Should THROW ERROR when you want to enter a userName with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addUserNameMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.addDocumentImage(
			addFieldUserNameMandatory.userName,
			addFieldUserNameMandatory.operationId,
			addFieldUserNameMandatory.side,
			base64Img.addFront,
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
		const result = await vuScurity.addDocumentImage(
			addFieldOperationIdMandatory.userName,
			addFieldOperationIdMandatory.operationId,
			addFieldOperationIdMandatory.side,
			base64Img.addFront,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(2);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a side with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addSideMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.addDocumentImage(
			addFielSideMandatory.userName,
			addFielSideMandatory.operationId,
			addFielSideMandatory.side,
			base64Img.addEmpty,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(3);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a different photo`, async done => {
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		try {
			 await vuScurity.addDocumentImage(
				addFielSideMandatory.userName,
				addFielSideMandatory.operationId,
				addFielSideMandatory.side,
				base64Img.addSendingAnyPhoto,
				TOKEN
			);	
		} catch (error) {
			expect(error).toEqual(Error("Add back fail"));	
		}
		done();
	}, 5000);
});
