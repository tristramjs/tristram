/* @flow */
import { appendFile, writeFile } from '../util/fs';

import appendToXml from './appendToXml';

import type { Writer } from './index';

type Props = {
	path: string,
	fileName: string,
};

export default class FileWriter implements Writer {
	path: string;
	fileName: string;
	sitemaps: number;
	sitemap: AsyncGenerator<void, void, string>;

	constructor({ path, fileName }: Props) {
		this.path = path;
		this.fileName = fileName;
		this.sitemaps = 0;
	}

	async createSitemap(): Promise<string> {
		const path = this.getSitemapPath();
		await writeFile(path, '');
		this.sitemap = appendToXml(data => appendFile(path, data));
		this.sitemaps = this.sitemaps + 1;

		return path;
	}

	async writeChunk(data: string) {
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

	async createIndexSitemap(data: string) {
		await writeFile(`${this.path}indexSitemap.xml`, data);
	}

	getSitemapPath() {
		return `${this.path}${this.fileName}-${this.sitemaps}.xml`;
	}

	getPath() {
		return this.path;
	}
}
