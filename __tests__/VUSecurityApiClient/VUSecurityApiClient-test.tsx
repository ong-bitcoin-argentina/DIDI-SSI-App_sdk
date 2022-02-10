require('isomorphic-fetch');
jest.mock('node-fetch');
const fetch = jest.fn();
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';
import base64Img from '../image/file.json';
//config
import { URI_VU_SECURITY, TOKEN } from './request/config.test.json';

//request
import createVerificationRequest from './request/createVerificationRequest.json';
import createVerificationforCancelRequest from './request/createVerificationforCancelRequest.json';
import addFrontRequest from './request/addFrontRequest.json';
import addBackRequest from './request/addBackRequest.json';
import addDocumentImageRequest from './request/addDocumentImageRequest.json'

//response
import createVerificationResponse from './response/createVerificationResponse.json';
import cancelVerificationResponse from './response/cancelVerificationResponse.json'
import addFrontResponse from './response/addFrontResponse.json';
import addBackResponse from './response/addBackResponse.json'
import addDocumentImageResponse from './response/addDocumentImageResponse.json'




describe("VUSecurityApiClient", () => {
   

   it(`createVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(createVerificationResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.createVerification(
         createVerificationRequest.did,
         createVerificationRequest.userName,
         createVerificationRequest.deviceHash,
         createVerificationRequest.rooted,
         createVerificationRequest.operativeSystem,
         createVerificationRequest.operativeSystemVersion,
         createVerificationRequest.deviceManufacturer,
         createVerificationRequest.deviceName,
          TOKEN
      );
      expect(Object.values(result)[1]).toEqual((await fetch()).message);
      expect(fetch).toHaveBeenCalledTimes(1);
      done();
   }, 5000);


   

   it(`cancelVerification`, async (done) => {
      fetch.mockReturnValue(Promise.resolve(cancelVerificationResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      // new vuSecurity
      const resultVU = await vuScurity.createVerification(
         createVerificationforCancelRequest.did,
         createVerificationforCancelRequest.userName,
         createVerificationforCancelRequest.deviceHash,
         createVerificationforCancelRequest.rooted,
         createVerificationforCancelRequest.operativeSystem,
         createVerificationforCancelRequest.operativeSystemVersion,
         createVerificationforCancelRequest.deviceManufacturer,
         createVerificationforCancelRequest.deviceName,
          TOKEN
     );  
      expect(Object.values(resultVU)[1]).toEqual("New operation created");
      // cancel vuSecurity
      const result = await vuScurity.cancelVerification(`${Object.values(resultVU)[3]}`,`${Object.values(resultVU)[2]}`,TOKEN);        
      expect(Object.values(result)[1]).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(2);
       done();
   }, 5000);



   it(`addFront`, async (done) => {      
      fetch.mockReturnValue(Promise.resolve(addFrontResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.addDocumentImage(
         addFrontRequest.userName,
         addFrontRequest.operationId,
         addFrontRequest.side,
         base64Img.addFront
         ,TOKEN);
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(3);
       done();
   }, 5000);



   it(`addBack`, async (done) => {      
      fetch.mockReturnValue(Promise.resolve(addBackResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.addDocumentImage(
         addBackRequest.userName,
         addBackRequest.operationId,
         addBackRequest.side,
         base64Img.addBack
         ,TOKEN);
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(4);
       done();
   }, 5000);

});