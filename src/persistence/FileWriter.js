/* @flow */
import { appendFile, writeFile } from '../util/fs';

import type { Writer, Path } from './index';

type Props = {
	path: Path,
	fileName: string,
};

export default class FileWriter implements Writer {
	path: Path;
	fileName: string;

	constructor({ path, fileName }: Props) {
		this.path = path;
		this.fileName = fileName;
	}

	async createSitemap(xmlDeclaration: string, openingUrlSet: string, partNumber: number): Promise<Path> {
		const path = this.getSitemapPath(partNumber);
		await writeFile(path, xmlDeclaration + openingUrlSet);

		return path;
	}

	async writeChunk(data: string, partNumber: number) {
		await appendFile(this.getSitemapPath(partNumber), data);
	}

	async commitSitemap(closingUrlSet: string, partNumber: number) {
		await appendFile(this.getSitemapPath(partNumber), closingUrlSet);
	}

	async createIndexSitemap(data: string) {
		await writeFile(`${this.path}indexSitemap.xml`, data);
	}

	getSitemapPath(partNumber: number) {
		return `${this.path}${this.fileName}-${partNumber}.xml`;
	}
}
