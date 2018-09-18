/* @flow */
import type { Fetcher, FetcherProps } from './index';

require('es6-promise').polyfill();
require('isomorphic-fetch');

type Props<T, S> = FetcherProps<T, S> & {
	chunkSize?: number,
	getConnection: GetConnection<T>,
	query: string,
	logErrors?: boolean,
	ignoreDataErrors?: boolean,
	maxRetries?: number,
};

type GetConnection<T> = <T>(x: Object) => GraphQlConnection<T>;
type GraphQlConnection<T> = { edges: { node: T, cursor: string }[], pageInfo: { hasNextPage: boolean } };

export default class RelayConnection<T, Data> implements Fetcher<Data[]> {
	url: string;
	query: string;
	chunkSize: number;
	transformResult: T => Data;
	logErrors: boolean;
	ignoreDataErrors: boolean;
	maxRetries: number;
	getConnection: GetConnection<T>;
	variables: {
		first: number,
		after?: string,
	} = {
		first: 10,
	};

	constructor({
		url, getConnection, transformResult, query, chunkSize, logErrors, ignoreDataErrors, maxRetries,
	}: Props<T, Data>) {
		this.url = url;
		this.getConnection = getConnection;
		this.transformResult = transformResult;
		this.query = query;
		this.maxRetries = maxRetries || 3;
		this.chunkSize = chunkSize || 100;
		this.logErrors = logErrors || false;
		this.ignoreDataErrors = ignoreDataErrors || false;
	}

	async* getData(): AsyncGenerator<Data[], void, void> {
		let hasNextPage;

		do {
			const data: GraphQlConnection<T> = await this.fetchConnection();

			yield data.edges.map(edge => this.transformResult(edge.node));
			({ hasNextPage } = data.pageInfo);

			this.variables = {
				first: this.chunkSize,
				after: data.edges[data.edges.length - 1].cursor,
			};
		} while (hasNextPage);
	}

	async fetchConnection(): Promise<GraphQlConnection<T>> {
		const {
			url, query, variables, getConnection, logErrors, ignoreDataErrors
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
			const res = await fetch(url, options);
			const data = await res.json();

			if (!ignoreDataErrors && data.errors && Array.isArray(data.errors)) {
				if (logErrors) {
					// eslint-disable-next-line no-console
					console.log(
						`RelayConnectionFetcher: Received errors in connection:\n"${data.errors
							.map(err => (err.message ? err.message : '<no error message provided>'))
							.join('\n')}"`
					);
				}

				retries = retries + 1;
			} else {
				return getConnection(data);
			}
		}

		throw new Error(`Error fetching connection, tried ${retries} times.`);
	}
}
