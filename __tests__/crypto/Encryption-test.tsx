import { Encryption } from "../../src/crypto/Encryption";

const plaintext = "TEST_PLAINTEXT";
const password = "password";

describe("encrypt/decrypt", () => {
	it("should encrypt", async () => {
		const result = await Encryption.encrypt(plaintext, password);
		expect(typeof result).toBe("string");
	});

	it("should encrypt with random IV", async () => {
		const first = await Encryption.encrypt(plaintext, password);
		const second = await Encryption.encrypt(plaintext, password);
		expect(first).not.toStrictEqual(second);
	});

	it("should round-trip", async () => {
		const ciphertext = await Encryption.encrypt(plaintext, password);
		const result = await Encryption.decrypt(ciphertext, password);
		expect(result).toStrictEqual(plaintext);
	});
});
