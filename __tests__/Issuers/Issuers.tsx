require("isomorphic-fetch");
jest.mock("node-fetch");
import { isRight } from 'fp-ts/lib/Either';
import { DidiServerApiClient } from '../../src/DidiServerApiClient';
import { DIDI_SERVER_URI, PRIVATE_KEY } from '../config/config.test.json';
describe("DIDI-SSI-SERVER", () => {

        it(`getIssuers`, async done => {
                const DidiServerClient = new DidiServerApiClient({ didiServerUri: DIDI_SERVER_URI }, PRIVATE_KEY);
                const result = await DidiServerClient.getIssuers();
                let decodedResult;
                if (isRight(result)) decodedResult = result.right.data.issuersList.find((re) => re.name === 'Emisor CU Test-A9')?.shareRequests;

                expect(decodedResult).toEqual([
                        '629636dfeadf74ef1a3e1420',
                        '6296585044a969696a026610',
                        '6297af0cb3e2fe1c23ca21b6',
                        '6297ba0ee1174340e0a117af',
                        '629e0ab7eba7c20014848c0e',
                        '62d03bb35fe3820013081bac',
                        '62d1cfd0d5766f001467d542',
                        '62f97073f04dc70019195fb6'
                ]);
                done()
        });

        it(`getShareRequestFromId`, async done => {
                const DidiServerClient = new DidiServerApiClient({ didiServerUri: DIDI_SERVER_URI }, PRIVATE_KEY);
                const result = await DidiServerClient.getShareRequestFromId('6297ba0ee1174340e0a117af');
                expect(result.data.type).toEqual("shareReq");
                expect(Object.keys(result.data.claims.verifiable)[0]).toEqual("mobilePhone");
                expect(result.data.claims.verifiable.mobilePhone.reason).toEqual("para poder tener acceso en la app");
                done()
        });

        it(`translate`, async done => {
                const DidiServerClient = new DidiServerApiClient({ didiServerUri: DIDI_SERVER_URI }, PRIVATE_KEY);
                const result = await DidiServerClient.credentialList();
                expect(result.status).toEqual('success');
                done()
        });

});
