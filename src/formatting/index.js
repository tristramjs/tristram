/* @flow */

// IDEA:
// class VanillaFormatter {}
//
// class NewsSiteMapFormatter extends VanillaFormatter {}

import type { RawSiteMapData } from '../main';
import { siteMapDataMapper, createSitemap } from './helper';
import xmlbuilder from 'xmlbuilder';

export interface Formatter {
	format(data: RawSiteMapData[]): string[],
}

export default class PlainFormatter implements Formatter {
	constructor() {}

	format(data: RawSiteMapData[]) {
		data.map(item => siteMapDataMapper(item));
		return [createSitemap(data)];
	}
}
