import * as aesjs from "aes-js";
import * as bcrypt from "react-native-bcrypt";

const KEYLEN = 32;

/**
 * Calcula el hash bcrypt de su argumento usando una sal predeterminada
 */
async function hash(message: string, hash_salt: string): Promise<string> {
	return new Promise((resolve, reject) => {
		bcrypt.hash(message, hash_salt, (error?: Error, result?: string) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

async function cipherFor(password: string): Promise<aesjs.ModeOfOperation.ModeOfOperationCTR> {
	const hashed = await hash(password, password);
	const [empty, type, rounds, offBaseKey] = hashed.split("$");
	const key = bcrypt.decodeBase64(offBaseKey, KEYLEN);
	return new aesjs.ModeOfOperation.ctr(key);
}

export const Encryption = {
	hash,

	/**
	 * Encripta un mensaje usando AES, modo CTR, derivando su clave de
	 * la contraseña provista.
	 * @see Encryption.decrypt
	 * @see Encryption.hash: Funcion de derivacion de clave
	 */
	async encrypt(plainText: string, password: string): Promise<string> {
		const cipher = await cipherFor(password);

		const textBytes = aesjs.utils.utf8.toBytes(plainText);
		const encryptedBytes = cipher.encrypt(textBytes);
		return aesjs.utils.hex.fromBytes(encryptedBytes);
	},

	/**
	 * Desencripta un mensaje encriptado por Encryption.encrypt
	 * @see Encryption.encrypt
	 */
	async decrypt(message: string, password: string): Promise<string> {
		const cipher = await cipherFor(password);

		const messageBytes = aesjs.utils.hex.toBytes(message);
		const decryptedBytes = cipher.decrypt(messageBytes);
		return aesjs.utils.utf8.fromBytes(decryptedBytes);
	}
};
