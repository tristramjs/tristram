/* @flow */
import type { Fetcher } from './index';
import type { RawSiteMapData } from '../main';
import HttpFetcher from './http';

type Props = {
	url: string,
	t: any => RawSiteMapData,
	query: string,
	variables?: {},
	getConnection?: any => any,
};

export default class GqlFetcher implements Fetcher {
	url: string;
	httpFetcher: HttpFetcher<*>;
	t: any => RawSiteMapData;

	constructor({ url, t, query, variables }: Props) {
		const fetchOptions = {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query, variables: variables || null }),
		};

		this.httpFetcher = new HttpFetcher({ url, t, fetchOptions });
	}

	async getData(): Promise<RawSiteMapData> {
		return await this.httpFetcher.getData();
	}
}
