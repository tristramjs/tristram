/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { ChunkFetcher } from './index';

export default class SyncFetcher implements ChunkFetcher {
	data: RawSiteMapData | RawSiteMapData[];

	constructor({ data }: any) {
		this.data = data;
	}

	async* getDataChunk() {
		const data = await test(this.data);
		yield data;
	}
}

function test(data) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), 1000);
	});
}
