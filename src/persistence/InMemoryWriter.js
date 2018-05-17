/* @flow */

import type { Writer } from './index';

export default class InMemoryWriter implements Writer {
	sitemaps = [];

	async write(key: string, data: string) {
		this.sitemaps.push(data);
		return key;
	}
}
