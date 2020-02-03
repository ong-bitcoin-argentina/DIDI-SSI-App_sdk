import * as crypto from "crypto";

const IV_LENGTH = 8;
const KEYLEN = 16;

const HASH_SALT = "9dbe65e522f6f60490f16705c88afed8";

async function hash(message: string): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.scrypt(message, HASH_SALT, KEYLEN, (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex"));
			}
		});
	});
}

const encryptionKeyFor = hash;

export const Encryption = {
	hash,

	async encrypt(plainText: string, password: string): Promise<string> {
		const iv = crypto.randomBytes(IV_LENGTH).toString("hex");
		const key = await encryptionKeyFor(password);

		const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
		let encrypted = cipher.update(plainText);

		encrypted = Buffer.concat([encrypted, cipher.final()]);

		return iv + ":" + encrypted.toString("hex");
	},

	async decrypt(message: string, password: string): Promise<string> {
		const [iv, ...encryptedTextHex] = message.split(":");
		const key = await encryptionKeyFor(password);

		const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

		const cipherText = Buffer.from(encryptedTextHex.join(":"), "hex");
		const decrypted = decipher.update(cipherText);

		return Buffer.concat([decrypted, decipher.final()]).toString();
	}
};
