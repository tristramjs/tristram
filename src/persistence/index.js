/* @flow */

export interface Writer {
	createSitemap(): Promise<string>;
	writeChunk(data: string): Promise<void>;
	commitSitemap(): Promise<void>;
}
