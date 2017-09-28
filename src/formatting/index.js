/* @flow */

// IDEA:
// class VanillaFormatter {}
//
// class NewsSiteMapFormatter extends VanillaFormatter {}

import type { RawSiteMapData, OptionsWithDefaults } from '../main';
import { siteMapDataMapper, createSitemap, createIndexSitemap } from './helper';
import type { MappedSiteMapData } from './helper';
import xmlbuilder from 'xmlbuilder';

export interface Formatter<OptionsWithDefaults> {
	format(data: RawSiteMapData[]): string[],
}

type Props = {
	options: OptionsWithDefaults,
};

export default class PlainFormatter implements Formatter<OptionsWithDefaults> {
	options: OptionsWithDefaults;

	constructor({ options }: Props) {
		this.options = options;
	}

	//TODO: add image etc
	format(data: RawSiteMapData[]): string[] {
		// bring data into right format
		// $FlowFixMe
		data = data.map(item => siteMapDataMapper(item));

		//check how many sitemaps to return
		if (data.length < this.options.maxItemsPerSitemap) {
			// $FlowFixMe
			return [createSitemap(data)];
		} else {
			const numberSitemaps = data.length / this.options.maxItemsPerSitemap;
			const output = [
				createIndexSitemap(
					numberSitemaps,
					this.options.hostname,
					this.options.path,
				),
			];

			// is this in any way possible in object orientated style?
			for (let i = 0; i < numberSitemaps; i++) {
				output.push(
					createSitemap(
						data.slice(
							i * this.options.maxItemsPerSitemap,
							(i + 1) * this.options.maxItemsPerSitemap,
						),
					),
				);
			}
			return output;
		}
	}
}
