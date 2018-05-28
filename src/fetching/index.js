/* @flow */
import RelayConnectionFetcher from './RelayConnectionFetcher';
import GraphQlFetcher from './GraphQlFetcher';
import HttpFetcher from './HttpFetcher';
import SyncFetcher from './SyncFetcher';

export interface Fetcher<Data> {
	getData(): AsyncIterable<Data>;
}

export interface FetcherProps<T, S> {
	url: string;
	transformResult: T => S;
}

export { RelayConnectionFetcher, GraphQlFetcher, HttpFetcher, SyncFetcher };
