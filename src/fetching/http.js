/* @flow */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import type { Fetcher } from './index';
import type { RawSiteMapData } from '../main';

type Props<T> = {
	url: string,
	fetchOptions?: $FlowFixMe,
	t: T => RawSiteMapData,
};

export default class HttpFetcher<T> implements Fetcher {
	url: string;
	t: T => RawSiteMapData;
	fetchOptions: $FlowFixMe;

	constructor(props: Props<T>) {
		this.url = props.url;
		this.t = props.t;
		this.fetchOptions = { ...props.fetchOptions };
	}

	async getData(): Promise<RawSiteMapData> {
		const res = await fetch(this.url, this.fetchOptions);
		const data = await res.json();
		const sitemapData = this.t(data);

		return sitemapData;
	}
}
