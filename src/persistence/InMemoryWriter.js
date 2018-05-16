/* @flow */

import type { Writer } from './index';

export default class InMemoryWriter implements Writer {
	sitemaps = [];

	async createSitemap(xmlDeclaration: string, openingTag: string, partNumber: number) {
		this.sitemaps.push(xmlDeclaration + openingTag);
		return `foo-${partNumber}`;
	}

	async writeChunk(data: string, partNumber: number) {
		this.sitemaps[partNumber] += data;
	}

	async commitSitemap(closingTag: string, partNumber: number) {
		this.sitemaps[partNumber] += closingTag;
	}

	async createIndexSitemap(data: string): Promise<void> {}

	getSitemapPath(partNumber: number) {
		return this.sitemaps[partNumber];
	}
}
