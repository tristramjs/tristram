/* @flow */

import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData } from '../main';

export type MappedSiteMapData = {
	loc: string,
	lastmod?: string,
	priority?: number,
	changefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never',
};

export function createSitemap(data: MappedSiteMapData[]): string {
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

//rename this!
export function siteMapDataMapper(item: RawSiteMapData): MappedSiteMapData {
	if (item.lastmod) {
		item.lastmod = item.lastmod.toISOString();
	}
	//more changes(renamings) to RawSiteMapData here

	return item;
}
