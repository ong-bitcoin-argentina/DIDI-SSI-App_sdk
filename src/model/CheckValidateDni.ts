export interface ICheckValidateDni {
    status: string;
    data:   Data;
}

interface Data {
    status:      string;
    operationId: string;
    did:         string;
}
