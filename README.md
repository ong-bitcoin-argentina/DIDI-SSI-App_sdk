# proyecto-didi/app-sdk

DIDI-SSI-App_sdk is the tool responsible for connecting the servers of DIDI Server, DIDI Issuer, DIDI Identidad, Coopsol Issuer, Mouro.

## Installation

You can install it from npm

`$ npm i @proyecto-didi/app-sdk`

## How to use DIDI Server
### Class Name
DidiServerApiClient
#### Parameters to instanciate the class
The class takes two parameters:
* **config**: An object containing: { didiServerUri: "http://api.didi.example.com/" }
* **privateKey**:  A safety value to password (type string)
#### Functions
changeEmail(did: EthrDID, validationCode: string, newEmail: string, password: string)
changePassword(did: EthrDID, oldPassword: string, newPassword: string)
changePhoneNumber(did: EthrDID, validationCode: string, newPhoneNumber: string, password: string, firebaseId?: string)
checkValidateDni(did: EthrDID, operationId: string)
recoverAccount(email: string, password: string, firebaseId?: string)
recoverPassword(email: string, validationCode: string, newPassword: string)
registerUser(did: EthrDID, userData: { email: string; phoneNumber: string; password: string; privateKeySeed: string; name: string; lastname: string }, firebaseId?: string):
sendSmsValidator(cellPhoneNumber: string, idCheck?: { did: EthrDID; password: string }, unique?: boolean)
sendMailValidator(eMail: string, idCheck?: { did: EthrDID; password: string}, unique?: boolean)
userLogin(did: EthrDID, email: string, password: string, firebaseId?: string)
renewFirebaseToken(credentials: Credentials, firebaseId: string)
verifyEmailCode(did: EthrDID, validationCode: string, email: string)
verifySmsCode(did: EthrDID, validationCode: string, phoneNumber: string)
getApiVersion()
getIssuerData(issuerDid: EthrDID)
getPrestadores()
shareData(data: ShareDataRequest)
semillasCredentialsRequest(did: EthrDID, dni: string)
validateDniWithSemillas(did: EthrDID, data: { dni: string; email: string; phone: string; name: string; lastName: string })
getSemillasValidation(did: EthrDID)
getPersonalData(did: EthrDID, userJWT: string)
sendPersonalData(did: EthrDID, name: string, lastname: string, userJWT: string)
sendProfileImage(did: EthrDID, file: any, userJWT: string)
userHasRondaAccount(did: EthrDID)
savePresentation(jwts: any)
saveShareRequest(userJWT: string, sharingJWT: string)
getShareRequestFromServer(token: string, idShareRequest: string)
getIssuers(limit?: number, page?: number)
getShareRequestFromId(idShareRequest: string)
credentialList()


## How to use DIDI Issuer
### Class Name
IssuerApiClient
#### Parameters to instanciate the class
The class takes one parameter:
* **_baseUrl**: An url  "http://api.issuer.example.com/" (type string)
#### Functions 
shareResponse(did: string, jwt: string, shareRequestId: string, token : string)

## How to use DIDI Identidad
### Class Name
VUSecurityApiClient
#### Parameters to instanciate the class
The class takes one parameter:
* **_baseUrl**: An url  "http://api.identity.example.com/" (type string)
#### Functions 
createVerification( did: string, userName: string, deviceHash: string, rooted: boolean, operativeSystem: string, operativeSystemVersion: string, deviceManufacturer: string, deviceName: string, ipAddress: string, token: string )
cancelVerification(userName: string, operationId: string, token: string)
addDocumentImage(userName: string, operationId: string, side: string, file: string, token: string)
getInformation(userName: string, operationId: string, token: string)
finishOperation(userName: string, operationId: string, token: string)
checkValidateDni(did: string, token: string)

## How to use Coopsol Issuer
### Class Name
VUSecurityApiClient
#### Parameters to instanciate the class
The class takes one parameter:
* **_baseUrl**: An url  "http://api.coopsol.example.com/" (type string)
#### Functions
dniIdentity(jwt: string)

## How to use Mouro
### Class Name
VUSecurityApiClient
#### Parameters to instanciate the class
The class takes two parameters:
* **config**: An object containing: { trustGraphUri: "http://mouro.example.com/graphql", credentials: An instance of the Credentials class from upport-credentials, used to sign tokens (type Class) }
#### Functions 
getJWTs()
insertJWT(jwt: string)


**NOTE 1** : EthrDID represents an ethereum-based DID, avoiding confusion between its representations such as ethereum address and as DID.

## Project Endpoints
For more information, see the [documentation](https://docs.didi.org.ar/docs/aidi/aidi-descripcion)