/* @flow */
import type { OptionsWithDefaults } from '../main';
import type { RawSiteMapData } from '../types/sitemap';

import { siteMapDataMapper } from './helper';

import type { Formatter, Props } from './index';

export default class PlainFormatter implements Formatter {
	options: OptionsWithDefaults;

	constructor({ options }: Props) {
		this.options = options;
	}

	format(data: RawSiteMapData[]): string[] {
		// bring data into right format
		// $FlowFixMe
		return data.map(item => siteMapDataMapper(item));

		// // check how many sitemaps to return
		// if (data.length < this.options.maxItemsPerSitemap) {
		// 	// $FlowFixMe
		// 	return [ createSitemap(data) ];
		// }
		// const numberSitemaps =
		// 	data.length % this.options.maxItemsPerSitemap === 0
		// 		? data.length / this.options.maxItemsPerSitemap
		// 		: Math.floor(data.length / this.options.maxItemsPerSitemap) + 1;
		// const output = [ createIndexSitemap(numberSitemaps, this.options.hostname, this.options.path) ];
		//
		// // is this in any way possible in object orientated style?
		// for (let i = 0; i < numberSitemaps; i++) {
		// 	output.push(
		// 		createSitemap(data.slice(i * this.options.maxItemsPerSitemap, (i + 1) * this.options.maxItemsPerSitemap))
		// 	);
		// }
		// return output;
	}
}
