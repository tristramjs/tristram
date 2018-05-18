/* @flow */
import type { RawSiteMapData } from '../types/sitemap';

import RelayConnectionFetcher from './RelayConnectionFetcher';
import GraphQlFetcher from './GraphQlFetcher';
import HttpFetcher from './HttpFetcher';
import SyncFetcher from './SyncFetcher';

export interface Fetcher {
	getData(): AsyncIterable<RawSiteMapData[]>;
}

export interface FetcherProps<T> {
	url: string;
	transformResult: T => RawSiteMapData;
}

export { RelayConnectionFetcher, GraphQlFetcher, HttpFetcher, SyncFetcher };
