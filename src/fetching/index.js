/* @flow */
import type { RawSiteMapData } from '../main.js';

export interface Fetcher {
	getData(): Promise<RawSiteMapData>,
}
