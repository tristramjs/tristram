/* @flow */
import fs from 'fs';

import { appendFile, writeFile } from '../util/fs';
import type { RawSiteMapData } from '../types/sitemap';

import appendToXml from './appendToXml';

import type { Writer } from './index';

export default class FileWriter implements Writer {
	sitemap: AsyncGenerator<void, void, RawSiteMapData>;

	async createSitemap(path: string) {
		await writeFile(path, '');
		this.sitemap = appendToXml(data => appendFile(path, data));
	}

	async writeChunk(data: RawSiteMapData) {
		if (this.sitemap) {
			await this.sitemap.next(data);
		} else {
			throw new Error('Cant write to file. Did you forget to call/await `createSitemap`?');
		}
	}

	async commitSitemap() {
		if (this.sitemap) {
			await this.sitemap.return();
		} else {
			throw new Error('Cant write to file. Did you forget to call/await `createSitemap`?');
		}
	}
}
