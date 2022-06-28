require("isomorphic-fetch");
jest.mock("node-fetch");
import { CoopsolApiClient } from '../../src/CoopsolApiClient';
import addUserDniIdentity from '../Coopsol/request/addUserDniIdentity.json';
import addUserDniIdentityResponse from '../Coopsol/response/addUserDniIdentityResponse.json';
import {COOPSOL_URI} from '../config/config.test.json';

describe("DIDI-SSI-SERVER", () => {

    it(`dniIdentity`, async done => {        
        const CoopsolClient = new CoopsolApiClient(COOPSOL_URI);
        const result = await CoopsolClient.dniIdentity(
            addUserDniIdentity.credential
        );
        expect(result.did).toEqual(addUserDniIdentityResponse.did);
        done()
	});

});
