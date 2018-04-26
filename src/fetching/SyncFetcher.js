/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { ChunkFetcher } from './index';

export default class SyncFetcher implements ChunkFetcher {
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
