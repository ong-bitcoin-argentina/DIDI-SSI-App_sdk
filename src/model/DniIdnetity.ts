export type IShareResp  = IReturn;

 interface IReturn {
    _id:         string;
    firstname:   string;
    lastname:    string;
    dni:         string;
    nationality: string;
    did:         string;
    createdAt:   Date;
    updatedAt:   Date;
    __v:         number;
}
