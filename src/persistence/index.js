/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

export interface Writer {
	createSitemap(path: string): Promise<void>;
	writeChunk(data: RawSiteMapData): Promise<void>;
	commitSitemap(): Promise<void>;
}
