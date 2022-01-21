require('isomorphic-fetch');
jest.mock('node-fetch');
const fetch = jest.fn();
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';

const responseRegisterUser = {}
const responseCreateVerification = {"userName": "VU-TEST-SDK-1","operationId": 853}
const responseCancelVerification = "Operacion cancelada exitosamente";


describe("VUSecurityApiClient", () => {
   it(`registerUser`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(responseRegisterUser));
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.registerUser('did:ethr:0x0000000000000000000000000000000000000001','VU-TEST-SDK-1','VU-TEST-SDK');
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(1);
      done();
   }, 30000);
   

   it(`createVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(responseCreateVerification));
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.createVerification(
         "did:ethr:0x0000000000000000000000000000000000000001",
         "VU-TEST-SDK-1",
          "hash",
          false,
          "console test",
          "11",
          "Apple",
          "Iphone"
     )
      expect(Object.values(result)[0]).toEqual((await fetch()).userName);
      expect(fetch).toHaveBeenCalledTimes(2);
       done();
   }, 30000);

   it(`cancelVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(responseCancelVerification));
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      // new registro,
      const resultR = await vuScurity.registerUser('did:ethr:0x0000000000000000000000000000000000000002','VU-TEST-SDK-2','VU-TEST-SDK-2');
      expect(resultR).toEqual({})
      // new vuSecurity
      const resultVU = await vuScurity.createVerification(
         "did:ethr:0x0000000000000000000000000000000000000002",
         "VU-TEST-SDK-2",
          "hash",
          false,
          "console test",
          "11",
          "Apple",
          "Iphone"
     )     
      expect(Object.values(resultVU)[0]).toEqual("VU-TEST-SDK-2");
      // cancel vuSecurity
      const result = await vuScurity.cancelVerification(Object.values(resultVU)[0],Object.values(resultVU)[1])
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(3);
       done();
   }, 90000);
});