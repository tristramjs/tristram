/* @flow */

export interface Writer {
	createSitemap(): Promise<string>;
	writeChunk(data: string): Promise<void>;
	commitSitemap(): Promise<void>;
	createIndexSitemap(data: string): Promise<void>;
	getPath(): string;
	getSitemapPath(): string;
}
