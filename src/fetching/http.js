/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { Fetcher, FetcherProps } from './index';

require('es6-promise').polyfill();
require('isomorphic-fetch');

type Props<T> = FetcherProps<T> & {
	fetchOptions?: $FlowFixMe,
};

export default class HttpFetcher<T> implements Fetcher {
	url: string;
	transformResult: T => RawSiteMapData;
	fetchOptions: $FlowFixMe;

	constructor(props: Props<T>) {
		this.url = props.url;
		this.transformResult = props.transformResult;
		this.fetchOptions = props.fetchOptions;
	}

	async getData(): Promise<RawSiteMapData[]> {
		const res = await fetch(this.url, this.fetchOptions);
		const data = await res.json();
		const sitemapData = this.transformResult(data);
		return [ sitemapData ];
	}
}
