/**
 * Representa un DID basado en ethereum, evitando confusion entre sus
 * representaciones como direccion ethereum y como DID.
 */
export class EthrDID {
	private address: string;

	private constructor(address: string) {
		this.address = address;
	}

	did() {
		return `did:ethr:${this.address}`;
	}

	keyAddress() {
		return this.address;
	}

	/**
	 * Construye un objecto EthrDID a partir de una direccion ethereum
	 * @throws {Error} si su parametro no es una direccion ethereum bien
	 * formada ("0x" + 40 caracteres hexadecimales)
	 */
	static fromKeyAddress(address: string): EthrDID {
		return new EthrDID(address);
	}

	/**
	 * Construye un objecto EthrDID a partir de un DID string
	 * @throws {Error} si su parametro no es un did ethereum bien formado
	 * ("did:ethr:0x" + 40 caracteres hexadecimales)
	 */
	static fromDID(did: string): EthrDID {
		const splittedDid = did.split(":");
		const address = splittedDid.slice(2).join(":");

		return new EthrDID(address);
	}
}
