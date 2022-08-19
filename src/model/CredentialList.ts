export type ICredentialList = Credentia & IError;

interface IError {
    status: string;
    errorCode?: string;
    message?: string;
}


interface Credentia {
    status: string;
    data: Data;
}

interface Data {
    credential_categories: any;
}
