/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

export interface Writer {
	createSitemap(): Promise<string>;
	writeChunk(data: RawSiteMapData[]): Promise<void>;
	commitSitemap(): Promise<void>;
}
