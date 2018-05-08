/* @flow */

export interface Writer {
	createSitemap(xmlDeclaration: string, openingTag: string): Promise<string>;
	writeChunk(data: string): Promise<void>;
	commitSitemap(closingTag: string): Promise<void>;
	createIndexSitemap(data: string): Promise<void>;
	getPath(): string;
	getSitemapPath(): string;
}
