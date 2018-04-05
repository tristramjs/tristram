/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

export interface Fetcher {
	getData(): Promise<RawSiteMapData[]>;
}

export interface ChunkFetcher {
	getDataChunk(): AsyncIterable<RawSiteMapData[]>;
}

export interface FetcherProps<T> {
	url: string;
	transformResult: T => RawSiteMapData;
}
