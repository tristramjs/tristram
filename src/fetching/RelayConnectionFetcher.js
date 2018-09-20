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
	retryCodes?: Array<number>;
	exitCodes?: Array<number>;
};

type GetConnection<T> = <T>(x: Object) => GraphQlConnection<T>;
type GraphQlConnection<T> = { edges: { node: T, cursor: string }[], pageInfo: { hasNextPage: boolean } };
type GraphQlErrors = Array<{ message: string }>;
type FetchResult<T> = { data: GraphQlConnection<T>, errors: ?GraphQlErrors };

export default class RelayConnection<T, Data> implements Fetcher<Data[]> {
	url: string;
	query: string;
	chunkSize: number;
	transformResult: (T, ?GraphQlErrors) => Data;
	logErrors: boolean;
	maxRetries: number;
	retryCodes: Array<number>;
	exitCodes: Array<number>;
	getConnection: GetConnection<T>;
	variables: {
		first: number,
		after?: string,
	} = {
		first: 10,
	};

	constructor({
		url,
		getConnection,
		transformResult,
		query,
		chunkSize,
		logErrors,
		maxRetries,
		retryCodes,
		exitCodes,
	}: Props<T, Data>) {
		this.url = url;
		this.getConnection = getConnection;
		this.transformResult = transformResult;
		this.query = query;
		this.maxRetries = maxRetries || 3;
		this.chunkSize = chunkSize || 100;
		this.logErrors = logErrors || false;
		/* eslint-disable line-comment-position */
		this.retryCodes = retryCodes || [
			408, // Request Timeout
			429, // Too Many Requests
			449, // The request should be retried after doing the appropriate action
			499, // Client Closed Request
			500, // Internal Server Error
			502, // Bad Gateway
			503, // Service Unavailable
			504, // Gateway Timeout
		];
		this.exitCodes = exitCodes || [
			400, // Bad Request
			404, // Not Found
		];
		/* eslint-enable line-comment-position */
	}

	async* getData(): AsyncGenerator<Data[], void, void> {
		let hasNextPage;

		do {
			const { data, errors } = await this.fetchConnection();

			yield data.edges.map(edge => this.transformResult(edge.node, errors));
			({ hasNextPage } = data.pageInfo);

			this.variables = {
				first: this.chunkSize,
				after: data.edges[data.edges.length - 1].cursor,
			};
		} while (hasNextPage);
	}

	async fetchConnection(): Promise<FetchResult<T>> {
		const {
			url, query, variables, getConnection, logErrors, retryCodes, exitCodes,
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
				const { status } = res;
				if (retryCodes.includes(status)) {
					retries = retries + 1;
					if (logErrors) {
						// eslint-disable-next-line no-console
						console.log(`RelayConnectionFetcher: retry after server response code ${status}`);
					}
				} else if (exitCodes.includes(status)) {
					throw new Error(`server response error ${status}`);
				} else {
					const data = await res.json();
					return {
						data: getConnection(data),
						errors: data.errors,
					};
				}
			} catch (error) {
				if (logErrors) {
					// eslint-disable-next-line no-console
					console.log('RelayConnectionFetcher: Received major error while fetching connection: ', error);
				}
				throw error;
			}
		}

		throw new Error(`Error fetching connection, tried ${retries} times.`);
	}
}
