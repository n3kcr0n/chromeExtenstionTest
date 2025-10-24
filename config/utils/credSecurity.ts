import Cryptr from "cryptr";

export default class CredentialSecurity {
    private cryptr: Cryptr;
    constructor() {
        this.cryptr = new Cryptr(process.env.SECRET_KEY || 'defaultSecret', {
            encoding: "base64",
            pbkdf2Iterations: 10000,
            saltLength: 32,
        });
    }

    encrypt(value: string): string {
        return this.cryptr.encrypt(value);
    }

    decrypt(value: string): string {
        return this.cryptr.decrypt(value);
    }
}
