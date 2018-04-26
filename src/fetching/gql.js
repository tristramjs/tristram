/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import HttpFetcher from './http';

import type { Fetcher, FetcherProps } from './index';

type Props<T> = FetcherProps<T> & {
	query: string,
	variables?: {},
};

export default class GraphqlFetcher<T> implements Fetcher {
	url: string;
	httpFetcher: HttpFetcher<*>;
	transformResult: any => RawSiteMapData;

	constructor({
		url, transformResult, query, variables,
	}: Props<T>) {
		const fetchOptions = {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query, variables: variables || null }),
		};

		this.httpFetcher = new HttpFetcher({ url, transformResult, fetchOptions });
	}

	async getData() {
		return this.httpFetcher.getData();
	}
}
