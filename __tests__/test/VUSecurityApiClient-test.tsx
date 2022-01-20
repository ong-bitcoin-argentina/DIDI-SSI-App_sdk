require('isomorphic-fetch');
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';

describe("VUSecurityApiClient", () => {

   it(`registerUser`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.registerUser('did:ethr:0x0000000000000000000000000000000000000001','VU-TEST-SDK-1','VU-TEST-SDK')
      console.log(result);
      expect(result).toEqual({})
       done();
   }, 30000);
   

   it(`createVerification`, async (done) => {
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
      expect(Object.values(result)[0]).toEqual("VU-TEST-SDK-1");
       done();
   }, 30000);

   it(`createVerification`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      // new registro,
      const resultR = await vuScurity.registerUser('did:ethr:0x0000000000000000000000000000000000000002','VU-TEST-SDK-2','VU-TEST-SDK-2')    
      console.log(resultR);
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
         console.log('// cancel vuSecurity');
         console.log(result);
         
      expect(result).toEqual("Operacion cancelada exitosamente");
       done();
   }, 90000);
});