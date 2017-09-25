/* @flow */

// IDEA:
// class VanillaFormatter {}
//
// class NewsSiteMapFormatter extends VanillaFormatter {}

import type { RawSiteMapData } from '../main';
import xmlbuilder from 'xmlbuilder';

export interface Formatter {
	format(data: RawSiteMapData[]): string,
}

export default class PlainFormatter implements Formatter {
	constructor() {}

	format(data: RawSiteMapData[]) {
		data.map(item => {
			if (item.lastmod) {
				item.lastmod = item.lastmod.toDateString();
			}
			return item;
		});
		return xmlbuilder
			.create(
				{
					urlset: {
						'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
						url: data,
					},
				},
				{ encoding: 'UTF-8' },
			)
			.end();
	}
}
