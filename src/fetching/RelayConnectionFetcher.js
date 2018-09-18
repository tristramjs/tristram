/* @flow */
import type { Fetcher, FetcherProps } from './index';

require('es6-promise').polyfill();
require('isomorphic-fetch');

type Props<T, S> = FetcherProps<T, S> & {
	chunkSize?: number,
	getConnection: GetConnection<T>,
	query: string,
	logErrors?: boolean,
	maxRetries?: number,
};

type GetConnection<T> = <T>(x: Object) => GraphQlConnection<T>;
type GraphQlConnection<T> = { edges: { node: T, cursor: string }[], pageInfo: { hasNextPage: boolean } };

export default class RelayConnection<T, Data> implements Fetcher<Data[]> {
	url: string;
	query: string;
	chunkSize: number;
	transformResult: (T, ?Array<{ message: string, ...any }>) => Data;
	logErrors: boolean;
	maxRetries: number;
	retrieCodes: [number];
	exitCodes: [number];
	getConnection: GetConnection<T>;
	variables: {
		first: number,
		after?: string,
	} = {
		first: 10,
	};

	constructor({
		url, getConnection, transformResult, query, chunkSize, logErrors, maxRetries, retrieCodes, exitCodes,
	}: Props<T, Data>) {
		this.url = url;
		this.getConnection = getConnection;
		this.transformResult = transformResult;
		this.query = query;
		this.maxRetries = maxRetries || 3;
		this.chunkSize = chunkSize || 100;
		this.logErrors = logErrors || false;
		this.retrieCodes = retrieCodes || [ 429, 500 ];
		this.exitCodes = exitCodes || [ 404 ];
	}

	async* getData(): AsyncGenerator<Data[], void, void> {
		let hasNextPage;

		do {
			const data: GraphQlConnection<T> = await this.fetchConnection();

			yield data.edges.map(edge => this.transformResult(edge.node, data.errors));
			({ hasNextPage } = data.pageInfo);

			this.variables = {
				first: this.chunkSize,
				after: data.edges[data.edges.length - 1].cursor,
			};
		} while (hasNextPage);
	}

	async fetchConnection(): Promise<GraphQlConnection<T>> {
		const {
			url, query, variables, getConnection, logErrors, retrieCodes, exitCodes,
		} = this;
		let retries = 0;
		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ query, variables }),
		};

		while (retries < this.maxRetries) {
			try {
				const res = await fetch(url, options);
				if (retrieCodes.includes(res.statusCode)) {
					retries = retries + 1;
					// eslint-disable-next-line no-console
					console.log(`RelayConnectionFetcher: retry after server response code ${res.statusCode}`);
				} else if (exitCodes.includes(res.statusCode)) {
					throw new Error(`server response error ${res.statusCode}`);
				} else {
					const data = await res.json();
					return getConnection(data);
				}
			} catch (error) {
				if (logErrors) {
					// eslint-disable-next-line no-console
					console.log('RelayConnectionFetcher: Received errors while fetching connection: ', error);
				}
			}
		}

		throw new Error(`Error fetching connection, tried ${retries} times.`);
	}
}
