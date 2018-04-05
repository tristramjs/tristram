/* @flow */
import fs from 'fs';
import util from 'util';

import type { RawSiteMapData } from '../types/sitemap';

import appendToXml from './appendToXml';

import type { Writer } from './index';

const appendFile = util.promisify(fs.appendFile);

export default class FileWriter implements Writer {
	sitemap: AsyncGenerator<void, void, RawSiteMapData[]>;

	async createSitemap(path: string) {
		return new Promise((resolve, reject) => {
			fs.writeFile(path, '', (err) => {
				if (!err) {
					this.sitemap = appendToXml(data => appendFile(path, data));
					resolve();
				}
				reject(err);
			});
		});
	}

	async writeChunk(data: RawSiteMapData[]) {
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
