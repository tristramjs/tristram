/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { Fetcher, FetcherProps } from './index';

require('es6-promise').polyfill();
require('isomorphic-fetch');

type Props<T> = FetcherProps<T> & {
	chunkSize?: number,
	getConnection: GetConnection<T>,
	query: string,
};

type GetConnection<T> = <T>(x: Object) => GraphQlConnection<T>;
type GraphQlConnection<T> = { edges: { node: T, cursor: string }[], pageInfo: { hasNext: boolean } };

export default class RelayConnection<T> implements Fetcher {
	url: string;
	query: string;
	chunkSize: number;
	transformResult: T => RawSiteMapData;
	getConnection: GetConnection<T>;
	variables: {
		first: number,
		after?: string,
	} = {
		first: 10,
	};

	constructor({
		url, getConnection, transformResult, query, chunkSize,
	}: Props<T>) {
		this.url = url;
		this.getConnection = getConnection;
		this.transformResult = transformResult;
		this.query = query;
		this.chunkSize = chunkSize || 100;
	}

	async* getData(): AsyncGenerator<RawSiteMapData[], void, void> {
		let hasNext;

		do {
			try {
				const data: GraphQlConnection<T> = await this.fetchConnection();

				yield data.edges.map(edge => this.transformResult(edge.node));
				({ hasNext } = data.pageInfo);

				this.variables = {
					first: this.chunkSize,
					after: data.edges[data.edges.length - 1].cursor,
				};
			} catch (err) {
				/* eslint-disable no-console */
				console.error(err);
				/* eslint-enable no-console */
				break;
			}
		} while (hasNext);
	}

	async fetchConnection(): Promise<GraphQlConnection<T>> {
		const {
			url, query, variables, getConnection,
		} = this;
		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ query, variables }),
		};
		const res = await fetch(url, options);
		const data = await res.json();

		return getConnection(data);
	}
}