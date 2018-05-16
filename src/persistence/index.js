/* @flow */

export type Path = string;

export interface Writer {
	createSitemap(xmlDeclaration: string, openingTag: string, partNumber: number): Promise<Path>;
	writeChunk(data: string, partNumber: number): Promise<void>;
	commitSitemap(closingTag: string, partNumber: number): Promise<void>;
	createIndexSitemap(data: string): Promise<void>;
	getSitemapPath(partNumber: number): Path;
}
