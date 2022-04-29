require("isomorphic-fetch");
jest.mock("node-fetch");
const fetch = jest.fn();
import { VUSecurityApiClient } from "../../src/VUSecurityApiClient";
//config
import { URI_VU_SECURITY, TOKEN } from "../config/config.test.json";

//request
import createVerificationRequest from "./request/addCreateVerificationSuccess/createVerificationRequest.json";

//response
import successfulResponse from "./response/checkValidateDni/checkValidateDniSuccessfulResponse.json";
import inProgressResponse from "./response/checkValidateDni/checkValidateDniInProgressResponse.json";

describe("checkValidateDni", () => {


	it(`Successful`, async done => {
		fetch.mockReturnValue(Promise.resolve(successfulResponse));
		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		const result = await vuScurity.checkValidateDni(
			"did:ethr:0x00012",
			TOKEN
		);
        
		expect(result.status).toEqual("success");
        expect(result.data.status).toEqual((await fetch()).data.status);
		expect(fetch).toHaveBeenCalledTimes(1);
		done();
	}, 1500);

    it(`In Progress`, async done => {
		fetch.mockReturnValue(Promise.resolve(inProgressResponse));

		const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		await vuScurity.createVerification(
			createVerificationRequest.did+" _++",
			createVerificationRequest.userName+" _++",
			createVerificationRequest.deviceHash,
			createVerificationRequest.rooted,
			createVerificationRequest.operativeSystem,
			createVerificationRequest.operativeSystemVersion,
			createVerificationRequest.deviceManufacturer,
			createVerificationRequest.deviceName,
			createVerificationRequest.ipAddress,
			TOKEN
		);

		const resultCheck = await vuScurity.checkValidateDni(
			createVerificationRequest.did+" _++",
			TOKEN
		);
		expect(resultCheck.status).toEqual("success");
        expect(resultCheck.data.status).toEqual((await fetch()).data.status);
		expect(fetch).toHaveBeenCalledTimes(2);
		done();
	}, 2000);

    it(`Failed`, async done => {
        try {
        const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
		await vuScurity.checkValidateDni(
			"did:ethr:0x00000009x9x",
			TOKEN
		);
        
        } catch (error) {
            expect(error).toEqual(Error('No se encontró ningun usuario con el did ingresado. Inténtelo nuevamente más tarde.'))    
        }
		done();
	}, 2200);



	
});
