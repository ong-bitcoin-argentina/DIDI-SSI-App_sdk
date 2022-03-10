require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";

//config
import { URI_VU_SECURITY, TOKEN } from "../config/config.test.json";

//request
import addFieldDidiMandatory from "./request/createVerification/addFieldDidiMandatory.json";
import addFieldUserNameMandatory from "./request/createVerification/addFieldUserNameMandatory.json";
import addFielDeviceHashMandatory from "./request/createVerification/addFielDeviceHashMandatory.json";
import addFieldOperativeSystemMandatory from "./request/createVerification/addFieldOperativeSystemMandatory.json";
import addFieldOperativeSystemVersionMandatory from "./request/createVerification/addFieldOperativeSystemVersionMandatory.json";
import addFieldDeviceManufacturerMandatory from "./request/createVerification/addFieldDeviceManufacturerMandatory.json";
import addFieldDeviceNameMandatory from "./request/createVerification/addFieldDeviceNameMandatory.json";

//response
import addDidMandatoryResponse from "./response/createVerification/addDidMandatoryResponse.json";
import addUserNameMandatoryResponse from "./response/createVerification/addUserNameMandatoryResponse.json";
import addDeviceHashMandatoryResponse from "./response/createVerification/addDeviceHashMandatoryResponse.json";
import addOperativeSystemMandatoryResponse from "./response/createVerification/addOperativeSystemMandatoryResponse.json";
import addOperativeSystemVersionMandatoryResponse from "./response/createVerification/addOperativeSystemVersionMandatoryResponse.json";
import addDeviceManufacturerMandatoryResponse from "./response/createVerification/addDeviceManufacturerMandatoryResponse.json";
import addDeviceNameMandatoryResponse from "./response/createVerification/addDeviceNameMandatoryResponse.json";

describe("createVerification", () => {
	it(`Should THROW ERROR when you want to enter a Did with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addDidMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldDidiMandatory.did,
			addFieldDidiMandatory.userName,
			addFieldDidiMandatory.deviceHash,
			addFieldDidiMandatory.rooted,
			addFieldDidiMandatory.operativeSystem,
			addFieldDidiMandatory.operativeSystemVersion,
			addFieldDidiMandatory.deviceManufacturer,
			addFieldDidiMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(1);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a userName with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addUserNameMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldUserNameMandatory.did,
			addFieldUserNameMandatory.userName,
			addFieldUserNameMandatory.deviceHash,
			addFieldUserNameMandatory.rooted,
			addFieldUserNameMandatory.operativeSystem,
			addFieldUserNameMandatory.operativeSystemVersion,
			addFieldUserNameMandatory.deviceManufacturer,
			addFieldUserNameMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(2);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a deviceHash with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addDeviceHashMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFielDeviceHashMandatory.did,
			addFielDeviceHashMandatory.userName,
			addFielDeviceHashMandatory.deviceHash,
			addFielDeviceHashMandatory.rooted,
			addFielDeviceHashMandatory.operativeSystem,
			addFielDeviceHashMandatory.operativeSystemVersion,
			addFielDeviceHashMandatory.deviceManufacturer,
			addFielDeviceHashMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(3);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a operativeSystem with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addOperativeSystemMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldOperativeSystemMandatory.did,
			addFieldOperativeSystemMandatory.userName,
			addFieldOperativeSystemMandatory.deviceHash,
			addFieldOperativeSystemMandatory.rooted,
			addFieldOperativeSystemMandatory.operativeSystem,
			addFieldOperativeSystemMandatory.operativeSystemVersion,
			addFieldOperativeSystemMandatory.deviceManufacturer,
			addFieldOperativeSystemMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(4);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a operativeSystemVersion with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addOperativeSystemVersionMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldOperativeSystemVersionMandatory.did,
			addFieldOperativeSystemVersionMandatory.userName,
			addFieldOperativeSystemVersionMandatory.deviceHash,
			addFieldOperativeSystemVersionMandatory.rooted,
			addFieldOperativeSystemVersionMandatory.operativeSystem,
			addFieldOperativeSystemVersionMandatory.operativeSystemVersion,
			addFieldOperativeSystemVersionMandatory.deviceManufacturer,
			addFieldOperativeSystemVersionMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(5);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a deviceManufacturer with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addDeviceManufacturerMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldDeviceManufacturerMandatory.did,
			addFieldDeviceManufacturerMandatory.userName,
			addFieldDeviceManufacturerMandatory.deviceHash,
			addFieldDeviceManufacturerMandatory.rooted,
			addFieldDeviceManufacturerMandatory.operativeSystem,
			addFieldDeviceManufacturerMandatory.operativeSystemVersion,
			addFieldDeviceManufacturerMandatory.deviceManufacturer,
			addFieldDeviceManufacturerMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(6);
		done();
	}, 5000);

	it(`Should THROW ERROR when you want to enter a deviceName with space "" `, async done => {
		fetch.mockReturnValue(Promise.resolve(addDeviceNameMandatoryResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.createVerification(
			addFieldDeviceNameMandatory.did,
			addFieldDeviceNameMandatory.userName,
			addFieldDeviceNameMandatory.deviceHash,
			addFieldDeviceNameMandatory.rooted,
			addFieldDeviceNameMandatory.operativeSystem,
			addFieldDeviceNameMandatory.operativeSystemVersion,
			addFieldDeviceNameMandatory.deviceManufacturer,
			addFieldDeviceNameMandatory.deviceName,
			TOKEN
		);
		expect(result.status).toEqual("error");
		expect(result.message).toEqual((await fetch()).message);
		expect(fetch).toHaveBeenCalledTimes(7);
		done();
	}, 5000);
});
