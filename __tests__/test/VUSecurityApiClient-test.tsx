require('isomorphic-fetch');
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';

describe("VUSecurityApiClient", () => {

   it(`registerUser`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.registerUser('did:ethr:0x7abf8da6291faeb0FA7777FAc825ae6831762ab9','registerUser-TEST-SDK','Prueba-TEST-SDK')
      console.log(result);
      expect(result).toEqual({})
       done();
   }, 30000);
   

   it(`createVerification`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.createVerification(
         "did:ethr:0x7abf8da6291faeb0FA7777FAc825ae6831762ab9",
         "Prueba-TEST-SDK",
          "hash",
          false,
          "console test",
          "11",
          "Apple",
          "Iphone"
     )
      expect(Object.values(result)[0]).toEqual("Prueba-TEST-SDK");
       done();
   }, 30000);
   

});