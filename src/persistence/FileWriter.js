/* @flow */
import { appendFile, writeFile } from '../util/fs';

import type { Writer } from './index';

type Props = {
	path: string,
	fileName: string,
};

export default class FileWriter implements Writer {
	path: string;
	fileName: string;
	sitemaps: number;

	constructor({ path, fileName }: Props) {
		this.path = path;
		this.fileName = fileName;
		this.sitemaps = 0;
	}

	async createSitemap(xmlDeclaration: string, openingUrlSet: string): Promise<string> {
		const path = this.getSitemapPath();
		await writeFile(path, xmlDeclaration + openingUrlSet);

		return path;
	}

	async writeChunk(data: string) {
		await appendFile(this.getSitemapPath(), data);
	}

	async commitSitemap(closingUrlSet: string) {
		await appendFile(this.getSitemapPath(), closingUrlSet);
		this.sitemaps = this.sitemaps + 1;
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
