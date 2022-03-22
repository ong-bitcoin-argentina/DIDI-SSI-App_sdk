export interface IGetInformation {
    status: string;
    data:   Data;
}

interface Data {
    code:    number;
    message: string;
    ocr:     Ocr;
    barcode: Barcode;
}

interface Barcode {
    contains: boolean;
    readed:   boolean;
}

interface Ocr {
    lastNames: null;
    gender:    null;
    birthdate: null;
    names:     null;
    number:    null;
    extra:     Extra;
}

interface Extra {
    additional: string;
    mrz:        string;
}
