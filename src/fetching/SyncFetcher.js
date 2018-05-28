/* @flow */
import type { Fetcher } from './index';

export default class SyncFetcher<Data> implements Fetcher<Data[]> {
	data: Data[];

	constructor({ data }: { data: Data[] }) {
		this.data = data;
	}

	async* getData(): AsyncIterator<Data[]> {
		if (Array.isArray(this.data)) {
			yield this.data;
		} else {
			yield [ this.data ];
		}
	}
}
