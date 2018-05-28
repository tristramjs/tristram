/* @flow */
import HttpFetcher from './HttpFetcher';

import type { Fetcher, FetcherProps } from './index';

type Props<T, S> = FetcherProps<T, S> & {
	query: string,
	variables?: {},
};

export default class GraphqlFetcher<T, Data> implements Fetcher<Data[]> {
	url: string;
	httpFetcher: HttpFetcher<*, *>;
	transformResult: any => Data;

	constructor({
		url, transformResult, query, variables,
	}: Props<T, Data>) {
		const fetchOptions = {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query, variables: variables || null }),
		};

		this.httpFetcher = new HttpFetcher({ url, transformResult, fetchOptions });
	}

	async* getData(): AsyncIterator<Data[]> {
		yield* this.httpFetcher.getData();
	}
}
