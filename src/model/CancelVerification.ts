export interface ICancel {
    status: string;
    data:   Data;
}

interface Data {
    code:    number;
    message: string;
}
