import * as aesjs from "aes-js";
import * as bcrypt from "react-native-bcrypt";

const HASH_SALT = "***REMOVED***";
const KEYLEN = 32;

async function hash(message: string): Promise<string> {
	return new Promise((resolve, reject) => {
		bcrypt.hash(message, HASH_SALT, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

async function cipherFor(password: string): Promise<aesjs.ModeOfOperation.ModeOfOperationCTR> {
	const hashed = await hash(password);
	const [empty, type, rounds, offBaseKey] = hashed.split("$");
	const key = bcrypt.decodeBase64(offBaseKey, KEYLEN);
	return new aesjs.ModeOfOperation.ctr(key);
}

export const Encryption = {
	hash,

	async encrypt(plainText: string, password: string): Promise<string> {
		const cipher = await cipherFor(password);

		const textBytes = aesjs.utils.utf8.toBytes(plainText);
		const encryptedBytes = cipher.encrypt(textBytes);
		return aesjs.utils.hex.fromBytes(encryptedBytes);
	},

	async decrypt(message: string, password: string): Promise<string> {
		const cipher = await cipherFor(password);

		const messageBytes = aesjs.utils.hex.toBytes(message);
		const decryptedBytes = cipher.decrypt(messageBytes);
		return aesjs.utils.utf8.fromBytes(decryptedBytes);
	}
};
