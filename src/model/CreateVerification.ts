export interface IVerification {
    status: string;
    data:   Data;
}
interface Data {
    code:        number;
    message:     string;
    operationId: number;
    userName:    string;
}