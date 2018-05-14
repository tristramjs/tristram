/* @flow */

export type Path = string;

export interface Writer {
	createSitemap(xmlDeclaration: string, openingTag: string): Promise<Path>;
	writeChunk(data: string): Promise<void>;
	commitSitemap(closingTag: string): Promise<void>;
	createIndexSitemap(data: string): Promise<void>;
	getPath(): Path;
	getSitemapPath(): Path;
}
