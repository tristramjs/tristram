/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import type { ChunkFetcher } from './index';

export default class SyncFetcher implements ChunkFetcher {
	data: RawSiteMapData | RawSiteMapData[];

	constructor({ data }: any) {
		this.data = data;
	}

	* getDataChunk() {
		// const data = await test(this.data);
		// console.log(data);
		yield Promise.resolve(this.data);
	}
}

function test(data) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), 1000);
	});
}
