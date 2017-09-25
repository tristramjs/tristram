/* @flow */
import type { RawSiteMapData } from '../main.js';

export interface Fetcher<Args, Data: RawSiteMapData> {
	getData: (args: Args) => Promise<Data>,
}
