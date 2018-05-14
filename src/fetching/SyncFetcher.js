/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { Fetcher } from './index';

export default class SyncFetcher implements Fetcher {
	data: RawSiteMapData | RawSiteMapData[];

	constructor({ data }: { data: RawSiteMapData | RawSiteMapData[] }) {
		this.data = data;
	}

	async* getData(): AsyncIterator<RawSiteMapData[]> {
		if (Array.isArray(this.data)) {
			yield this.data;
		} else {
			yield [ this.data ];
		}
	}
}
