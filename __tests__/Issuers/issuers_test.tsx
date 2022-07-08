import { IssuerApiClient } from '../../src/IssuerApiClient';
import {URI_ISSUER_MODULE_BACKEND, AUTHORIZATIONTOKEN,AUTHORIZATIONTOKEN_EMPTY} from "../config/config.test.json";
import shareResponse from "./request/addShareResponse/addShareResponse.json"; 
import addFielJwtMandatory from "./request/addShareResponse/addFielJwtMandatory.json"; 
require("isomorphic-fetch");
jest.mock("node-fetch");

describe("DIDI-SSI-Issuer-module-backend", () => {

    it('share response with successful status', async done =>{
    const IssuerClient = new IssuerApiClient(URI_ISSUER_MODULE_BACKEND);
    const result = await IssuerClient.shareResponse(
        shareResponse.did,
        shareResponse.jwt,
        shareResponse.shareRequestId,
        AUTHORIZATIONTOKEN)
    expect(result.status).toEqual('success');    
    done();
    })

    it('Should THROW ERROR when you want to enter a jwt with space ""', async done =>{
        const IssuerClient = new IssuerApiClient(URI_ISSUER_MODULE_BACKEND);
        const result = await IssuerClient.shareResponse(
            addFielJwtMandatory.did,
            addFielJwtMandatory.jwt,
            shareResponse.shareRequestId,
            AUTHORIZATIONTOKEN)
        expect(result.status).toEqual('error');
        expect(result.data.message).toEqual('Falta el campo: jwt')
        done();
    
    })

    it('Should THROW ERROR when you want to enter a token with space ""', async done =>{
        try {
        const IssuerClient = new IssuerApiClient(URI_ISSUER_MODULE_BACKEND);
        await IssuerClient.shareResponse(
            shareResponse.did,
            shareResponse.jwt,
            shareResponse.shareRequestId,
            AUTHORIZATIONTOKEN_EMPTY)   
        } catch (error) {
        expect(error).toEqual(Error(`falta el campo: jwt`));
        }
        done();
    })

});
