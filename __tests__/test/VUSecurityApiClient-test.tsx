require('isomorphic-fetch');
jest.mock('node-fetch');
const fetch = jest.fn();
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';

const responseCreateVerification = {"userName": "VU-TEST-SDK-1","operationId": 853}
const responseCancelVerification = "Operacion cancelada exitosamente";
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE2NDMzOTk3NDIsImhvbGEiOiJ0ZXN0IiwiaXNzIjoiZGlkOmV0aHI6MHgzNmY2ZGMwNmQzNGIxNjRhZWM1NDIxYzkwNzFhMGQwNzc2NWQ0ZWUwIn0.MU3ckw90FxwWLXcHNlpLwKvXNzRX70_EIyd65AhH06Gt985HoEOZozNF0YXQ7phaw2efsK6Mx6UV0Pifa9VNIQA';

describe("VUSecurityApiClient", () => {
   

   it(`createVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(responseCreateVerification));
      const vuScurity = new VUSecurityApiClient('http://localhost:8089/api/vuSecurity');
      const result = await vuScurity.createVerification(
         "did:ethr:0x36f6dc06d34b164aec5421c9071a0d07765d4ee0",
         "VU-TEST-SDK-1",
          "hash",
          false,
          "console test",
          "11",
          "Apple",
          "Iphone",
          token
      )     
      expect(Object.values(result)[0]).toEqual((await fetch()).userName);
      expect(fetch).toHaveBeenCalledTimes(1);
       done();
   }, 30000);

   it(`cancelVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(responseCancelVerification));
      const vuScurity = new VUSecurityApiClient('http://localhost:8089/api/vuSecurity');
      // new vuSecurity
      const resultVU = await vuScurity.createVerification(
         "did:ethr:0x0000000000000000000000000000000000000002",
         "VU-TEST-SDK-2",
          "hash",
          false,
          "console test",
          "11",
          "Apple",
          "Iphone",
          token
     )     
      expect(Object.values(resultVU)[0]).toEqual("VU-TEST-SDK-2");
      // cancel vuSecurity
      const result = await vuScurity.cancelVerification(Object.values(resultVU)[0],`${Object.values(resultVU)[1]}`,token)
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(2);
       done();
   }, 60000);
   
});