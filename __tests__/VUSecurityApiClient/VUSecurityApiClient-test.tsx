require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";
import base64Img from "../config/image/file.json";
import base64ImgSuccess from "../config/image/fileSuccess.json"
//config
import { URI_VU_SECURITY, TOKEN,TOKEN_GO_TO_CANCEL } from "../config/config.test.json";

//request
import createVerificationRequest from "./request/addCreateVerificationSuccess/createVerificationRequest.json";
import createVerificationforCancelRequest from "./request/addCancelVerificationSuccess/createVerificationforCancelRequest.json";
import addFrontRequest from "./request/addFrontSuccess/addFrontRequest.json";
import addBackRequest from "./request/addBackSuccess/addBackRequest.json";
import addSelfieRequest from "./request/addSelfieSuccess/addSelfieRequest.json";
import createVerificationSuccessRequest from "./request/addUserSuccess/createVerificationRequest.json";
//response
import createVerificationResponse from "./response/addCreateVerificationSuccess/createVerificationResponse.json";
import cancelVerificationResponse from "./response/addCancelVerificationSuccess/cancelVerificationResponse.json";
import addFrontResponse from "./response/addFrontSuccess/addFrontResponse.json";
import addBackResponse from "./response/addBackSuccess/addBackResponse.json";
import addSelfieResponse from "./response/addSelfieSuccess/addSelfieResponse.json";
import finishOperationResponse from "./response/addFinishOperationSuccess/finishOperationResponse.json";
import getInformation from "./response/getInformation/getInformation.json";



describe("VUSecurityApiClient", () => {

	it(`createVerification`, async done => {
		let userRandom = require('crypto').randomBytes((new Uint32Array(1)).length)[0]; 
		fetch.mockReturnValue(Promise.resolve(createVerificationResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			createVerificationRequest.did,
			createVerificationRequest.userName,
			createVerificationRequest.deviceHash,
			createVerificationRequest.rooted,
			createVerificationRequest.operativeSystem,
			createVerificationRequest.operativeSystemVersion,
			createVerificationRequest.deviceManufacturer,
			createVerificationRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);

		expect(result.data.message).toEqual((await fetch()).data.message);
		expect(fetch).toHaveBeenCalledTimes(1);
		done();
	}, 5000);

	it(`cancelVerification`, async done => {
		fetch.mockReturnValue(Promise.resolve(cancelVerificationResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVU = await vuScurity.createVerification(
			createVerificationforCancelRequest.did,
			createVerificationforCancelRequest.userName,
			createVerificationforCancelRequest.deviceHash,
			createVerificationforCancelRequest.rooted,
			createVerificationforCancelRequest.operativeSystem,
			createVerificationforCancelRequest.operativeSystemVersion,
			createVerificationforCancelRequest.deviceManufacturer,
			createVerificationforCancelRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN_GO_TO_CANCEL,
		);
		expect(resultVU.data.message).toEqual("New operation created");
		const resultCancel = await vuScurity.cancelVerification(
			resultVU.data.userName,
			`${resultVU.data.operationId}`,
			TOKEN_GO_TO_CANCEL
		);
		expect(resultCancel.data.message).toEqual((await fetch()).data.message);
		expect(fetch).toHaveBeenCalledTimes(2);
		done();
	}, 5000);

	it(`addFront`, async done => {
		fetch.mockReturnValue(Promise.resolve(addFrontResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVerification = await vuScurity.createVerification(
			createVerificationRequest.did,
			createVerificationRequest.userName,
			createVerificationRequest.deviceHash,
			createVerificationRequest.rooted,
			createVerificationRequest.operativeSystem,
			createVerificationRequest.operativeSystemVersion,
			createVerificationRequest.deviceManufacturer,
			createVerificationRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);
		const result = await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addFrontRequest.side,
			base64Img.addFront,
			TOKEN
		);
		expect(result).toEqual(await fetch());
		expect(fetch).toHaveBeenCalledTimes(3);
		done();
	}, 15000);

	it(`addBack`, async done => {
		fetch.mockReturnValue(Promise.resolve(addBackResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVerification = await vuScurity.createVerification(
			createVerificationRequest.did,
			createVerificationRequest.userName,
			createVerificationRequest.deviceHash,
			createVerificationRequest.rooted,
			createVerificationRequest.operativeSystem,
			createVerificationRequest.operativeSystemVersion,
			createVerificationRequest.deviceManufacturer,
			createVerificationRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);

		 await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addFrontRequest.side,
			base64Img.addFront,
			TOKEN
		);

		const result = await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addBackRequest.side,
			base64Img.addBack,
			TOKEN
		);
		expect(result).toEqual(await fetch());
		expect(fetch).toHaveBeenCalledTimes(4);
		done();
	}, 20000);


	//addSelfie
	it(`addSelfie`, async done => {
		let userRandom = require('crypto').randomBytes((new Uint32Array(1)).length)[0]; 
		fetch.mockReturnValue(Promise.resolve(addSelfieResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVerification = await vuScurity.createVerification(
			createVerificationRequest.did,
			createVerificationRequest.userName+userRandom,
			createVerificationRequest.deviceHash,
			createVerificationRequest.rooted,
			createVerificationRequest.operativeSystem,
			createVerificationRequest.operativeSystemVersion,
			createVerificationRequest.deviceManufacturer,
			createVerificationRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);

		 await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addFrontRequest.side,
			base64Img.addFront,
			TOKEN
		);

		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addBackRequest.side,
			base64Img.addBack,
			TOKEN
		);

		const result = await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addSelfieRequest.side,
			base64Img.addSelfie,
			TOKEN
		);

		expect(result).toEqual(await fetch());
		expect(fetch).toHaveBeenCalledTimes(5);
		done();
	}, 21000);



	it(`getInformation`, async done => {
		fetch.mockReturnValue(Promise.resolve(getInformation));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVerification = await vuScurity.createVerification(
			createVerificationSuccessRequest.did,
			createVerificationSuccessRequest.userName,
			createVerificationSuccessRequest.deviceHash,
			createVerificationSuccessRequest.rooted,
			createVerificationSuccessRequest.operativeSystem,
			createVerificationSuccessRequest.operativeSystemVersion,
			createVerificationSuccessRequest.deviceManufacturer,
			createVerificationSuccessRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);
		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addFrontRequest.side,
			base64ImgSuccess.addFrontSuccess,
			TOKEN
		);
		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addBackRequest.side,
			base64ImgSuccess.addBackSuccess,
			TOKEN
		);

		const resultInformation = await vuScurity.getInformation(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			TOKEN
		);
		const response = await fetch();
		expect(resultInformation.status).toEqual(response.status);
		expect(fetch).toHaveBeenCalledTimes(6);
		done();
	}, 21000);
		
	it(`finishOperation`, async done => {
		let userRandom = require('crypto').randomBytes((new Uint32Array(1)).length)[0]; 
		fetch.mockReturnValue(Promise.resolve(finishOperationResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const resultVerification = await vuScurity.createVerification(
			createVerificationSuccessRequest.did,
			createVerificationSuccessRequest.userName+userRandom,
			createVerificationSuccessRequest.deviceHash,
			createVerificationSuccessRequest.rooted,
			createVerificationSuccessRequest.operativeSystem,
			createVerificationSuccessRequest.operativeSystemVersion,
			createVerificationSuccessRequest.deviceManufacturer,
			createVerificationSuccessRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);
		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addFrontRequest.side,
			base64ImgSuccess.addFrontSuccess,
			TOKEN
		);
		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addBackRequest.side,
			base64ImgSuccess.addBackSuccess,
			TOKEN
		);
		await vuScurity.addDocumentImage(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			addSelfieRequest.side,
			base64ImgSuccess.addSelfieSuccess,
			TOKEN
		); 
		const resultFinishOperation = await vuScurity.finishOperation(
			resultVerification.data.userName,
			`${resultVerification.data.operationId}`,
			TOKEN
		);
		expect(resultFinishOperation.status).toEqual((await fetch()).status);
		expect(fetch).toHaveBeenCalledTimes(7);
		done();
	}, 17000);
});
