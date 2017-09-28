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

export function createIndexSitemap(
	numberSitemaps: number,
	hostname: string,
): string {
	const indexItems = [];
	for (let i = numberSitemaps; i > 0; i--) {
		const sitemap = {
			loc: `https://${hostname}/sitemaps/${i}.xml`, //missing path!!!
		};
		indexItems.push(sitemap);
	}
	const xmlObj = {
		sitemapindex: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			sitemap: indexItems,
		},
	};
	return xmlbuilder.create(xmlObj, { encoding: 'UTF-8' }).end();
}

//rename this!
export function siteMapDataMapper(item: RawSiteMapData): MappedSiteMapData {
	const updated = { ...item };

	if (item.lastmod) {
		updated.lastmod = item.lastmod.toISOString();
	}
	// $FlowFixMe
	return updated;
}
