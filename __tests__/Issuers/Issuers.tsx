require("isomorphic-fetch");
jest.mock("node-fetch");
import { isRight, left, right } from 'fp-ts/lib/Either';
import { DidiServerApiClient } from '../../src/DidiServerApiClient';
import {DIDI_SERVER_URI,PRIVATE_KEY} from '../config/config.test.json';
describe("DIDI-SSI-SERVER", () => {

	it(`getIssuers`, async done => {
        const DidiServerClient = new DidiServerApiClient({ didiServerUri: DIDI_SERVER_URI},PRIVATE_KEY);
        const result = await DidiServerClient.getIssuers(4,1);
        let decodedResult;
        if(isRight(result)) decodedResult = result.right.data.issuersList[0].shareRequests;
	expect(decodedResult).toEqual([ '627d2cc461f12c0013fd1847', '627d358f61f12c0013fd184e','627d5200eba7c200148473ce' ]);
        done()
	});

        it(`getShareRequestFromId`, async done => {
        const DidiServerClient = new DidiServerApiClient({ didiServerUri: DIDI_SERVER_URI },PRIVATE_KEY);
        const result = await DidiServerClient.getShareRequestFromId('627d5200eba7c200148473ce');
        expect(result.data.type).toEqual("shareReq");
        expect(result.data.callback).toEqual("¿Por qué piden esta información?");
        expect(result.data.claims.verifiable.nationalId.reason).toEqual("Necesito confirmar que el DNI es el mismo que registramos");        
        done()
        });

});
