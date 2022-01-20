require('isomorphic-fetch');
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';


describe("VUSecurityApiClient", () => {

   
   it(`createVerification`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.registerUser('did:ethr:0x7abf8da6291faeb0FA7777FAc825ae6831762ab9','Prueba-TEST-SDK','Prueba-TEST-SDK')
      console.log(result);
      expect(result).toEqual("{}")
      done();
   }, 30000);
   
   it(`createVerification`, async (done) => {
      const vuScurity = new VUSecurityApiClient('http://localhost:8087/api/vuSecurity');
      const result = await vuScurity.createVerification(
         "did:ethr:0x7abf8da6291faeb0FA7777FAc825ae6831762ab9",
         "Prueba-TEST-SDK",
         "192.168.1.1",
          "hash",
          false,
          "1.0.0",
          "console test",
          "11",
          "Apple",
          "Iphone"
     )
      console.log(result);
      expect(result).toEqual('Creado Satisfactoriamente');
       done();
   }, 30000);

   

});