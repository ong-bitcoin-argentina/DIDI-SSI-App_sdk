import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import Credentials from "uport-credentials/lib/Credentials";

/**
 * Configuracion de TrustGraphClient
 */
export interface TrustGraphClientConfiguration {
	/**
	 * URI de la instancia de TrustGraph a usar
	 * @example "http://mouro.example.com/graphql"
	 */
	trustGraphUri: string;

	/**
	 * Instancia de la clase Credentials de uport-credentials, usada para
	 * firmar tokens
	 */
	credentials: Credentials;
}

/**
 * Cliente del servidor TrustGraph (tambien conocido como Mouro, por la
 * implementacion usada), el cual contiene los jwt asociados a cada usuario.
 */
export class TrustGraphClient {
	private credentials: Credentials;
	private client: ApolloClient<unknown>;

	constructor(config: TrustGraphClientConfiguration) {
		this.credentials = config.credentials;

		const authLink = setContext(async (_, { headers }) => {
			const token = await config.credentials.signJWT({}, 100);
			return {
				headers: { ...headers, authorization: `Bearer ${token}` }
			};
		});
		const httpLink = new HttpLink({
			uri: config.trustGraphUri
		});
		this.client = new ApolloClient({
			link: authLink.concat(httpLink),
			cache: new InMemoryCache()
		});
	}

	async getJWTs(): Promise<Array<{ jwt: string; hash: string }>> {
		const response = await this.client.query({
			query: gql`
			query findEdges($toDID: String, $revoked: Int) {
				findEdges(toDID: $toDID, revoked: $revoked) 
				{
					jwt
					hash
				}
			}
		`,
			variables: {
				toDID: this.credentials.did,
				revoked: 0
			}
		});
		if (response.errors) {
			throw response.errors;
		} else {
			return response.data.findEdges;
		}
	}

	async insertJWT(jwt: string): Promise<{ jwt: string; hash: string }> {
		const response = await this.client.mutate({
			mutation: gql`
				mutation addEdge($edgeJWT: String!, $did: String!) {
					addEdge(edgeJWT: $edgeJWT, did: $did) {
						jwt
						hash
					}
				}
			`,
			variables: {
				did: this.credentials.did,
				edgeJWT: jwt
			}
		});
		if (response.errors) {
			throw response.errors;
		} else {
			return response.data.addEdge;
		}
	}
}
