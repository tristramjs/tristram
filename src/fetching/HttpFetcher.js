/* @flow */
import SyncFetcher from './SyncFetcher';

import type { Fetcher, FetcherProps } from './index';

require('es6-promise').polyfill();
require('isomorphic-fetch');

type Props<T, S> = FetcherProps<T, S> & {
	fetchOptions?: $FlowFixMe,
};

export default class HttpFetcher<T, Data> implements Fetcher<Data[]> {
	url: string;
	transformResult: T => Data;
	fetchOptions: $FlowFixMe;

	constructor(props: Props<T, Data>) {
		this.url = props.url;
		this.transformResult = props.transformResult;
		this.fetchOptions = props.fetchOptions;
	}

	async* getData(): AsyncIterator<Data[]> {
		const res = await fetch(this.url, this.fetchOptions);
		const rawData = await res.json();
		const data = this.transformResult(rawData);

		if (Array.isArray(data)) {
			yield* new SyncFetcher({ data }).getData();
		} else {
			yield* new SyncFetcher({ data: [ data ] }).getData();
		}
	}
}
