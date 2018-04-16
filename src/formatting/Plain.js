/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { OptionsWithDefaults } from '../main';
import type { RawSiteMapData, MappedSiteMapData } from '../types/sitemap';

import { siteMapDataMapper } from './format';

import type { Formatter, Props } from './index';

export default class PlainFormatter implements Formatter {
	/*options: OptionsWithDefaults;

	constructor({ options }: Props) {
		this.options = options;
	}
*/
	format(data: RawSiteMapData[]): MappedSiteMapData[] {
		// bring data into right format
		// $FlowFixMe
		const mappedData = data.map(item => siteMapDataMapper(item));
		return xmlbuilder.begin().ele(mappedData).end();
		// return '<el>Hallo</el>';
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
