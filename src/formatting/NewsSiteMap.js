/* @flow */
import type { OptionsWithDefaults } from '../main';

import type { Formatter } from './index';

export default class NewsSiteMapFormatter implements Formatter<OptionsWithDefaults> {
	options: OptionsWithDefaults;

	constructor({ options }: Props) {
		this.options = options;
		if (this.options.maxItemsPerSitemap > 1000) {
			/* eslint-disable */
			console.log(
				"Google won't allow single news sitemaps with more than 1000 articles. You will receive a number of news sitemaps and a index sitemap."
			);
			/* eslint-enable */
			this.options.maxItemsPerSitemap = 1000;
		}
	}
	format(data) {
		// bring data into right format
		data = data.map(item => newsSiteMapDataMapper(item));

		// check how many sitemaps to return
		if (data.length < this.options.maxItemsPerSitemap) {
			return [ createNewsSitemap(data) ];
		}
		const numberSitemaps =
			data.length % this.options.maxItemsPerSitemap === 0
				? data.length / this.options.maxItemsPerSitemap
				: Math.floor(data.length / this.options.maxItemsPerSitemap) + 1;
		// TODO news!
		const output = [ createIndexSitemap(numberSitemaps, this.options.hostname, this.options.path) ];

		// is this in any way possible in object orientated style?
		for (let i = 0; i < numberSitemaps; i++) {
			output.push(
				createNewsSitemap(data.slice(i * this.options.maxItemsPerSitemap, (i + 1) * this.options.maxItemsPerSitemap))
			);
		}
		return output;
	}
}
