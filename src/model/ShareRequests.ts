export interface IIssuerShareRequest {
    status: string;
    data:   Data;
}


interface Data {
    iat:      number;
    callback: string;
    type:     string;
    claims:   Claims;
    aud:      string;
    iss:      string;
}

interface Claims {
    verifiable: Verifiable;
}

interface Verifiable {
    nationalId: NationalID;
    mobilePhone: MobilePhone;
}

interface MobilePhone {
    reason:   string;
    issuers:  Issuer[];
    required: boolean;
}
interface NationalID {
    reason:   string;
    issuers:  Issuer[];
    required: boolean;
}

interface Issuer {
    did: string;
    url: string;
}
