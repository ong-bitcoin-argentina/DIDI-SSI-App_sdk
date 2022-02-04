require('isomorphic-fetch');
jest.mock('node-fetch');
const fetch = jest.fn();
import {VUSecurityApiClient} from '../../src/VUSecurityApiClient';
import base64Img from '../img/file.json';
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
      expect(Object.values(result)[0]).toEqual((await fetch()).userName);
      expect(fetch).toHaveBeenCalledTimes(1);
       done();
   }, 30000);


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
      expect(Object.values(resultVU)[0]).toEqual("VU-TEST-SDK-2");
      // cancel vuSecurity
      const result = await vuScurity.cancelVerification(Object.values(resultVU)[0],`${Object.values(resultVU)[1]}`,TOKEN)
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(2);
       done();
   }, 60000);



   it(`addFront`, async (done) => {      
      fetch.mockReturnValue(Promise.resolve(addFrontResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.addFront(
         addFrontRequest.userName,
         addFrontRequest.operationId,
         base64Img.addFront
         ,TOKEN);              
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(3);
       done();
   }, 30000);



   it(`addBack`, async (done) => {      
      fetch.mockReturnValue(Promise.resolve(addBackResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.addBack(
         addBackRequest.userName,
         addBackRequest.operationId,
         base64Img.addBack
         ,TOKEN);
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(4);
       done();
   }, 30000);

   it(`addDocumentImage`, async (done) => {      
      fetch.mockReturnValue(Promise.resolve(addDocumentImageResponse));
      const vuScurity = new VUSecurityApiClient(URI_VU_SECURITY);
      const result = await vuScurity.addDocumentImage(
         addDocumentImageRequest.userName,
         addDocumentImageRequest.operationId,
         base64Img.addFront
         ,TOKEN);
      expect(result).toEqual(await fetch());
      expect(fetch).toHaveBeenCalledTimes(5);
       done();
   }, 30000);

});