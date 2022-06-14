export type IShareResp  = IReturn & IError ; 

interface IReturn {
    status: string;
    data:   string;
}

interface IError {
    status: string;
    data:   Data;
}

interface Data {
    code:    string;
    message: string;
}
