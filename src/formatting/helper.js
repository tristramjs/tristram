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
	const xmlObj = {
		urlset: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			url: data,
		},
	};
	const xml = createXML(xmlObj);
	return xml;
}

export function createIndexSitemap(
	numberSitemaps: number,
	hostname: string,
	path: string,
): string {
	const indexItems = [];
	for (let i = numberSitemaps; i > 0; i--) {
		const sitemap = {
			loc: `https://${hostname}/${path}/sitemap-${i}.xml`,
		};
		indexItems.push(sitemap);
	}

	const xmlObj = {
		sitemapindex: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			sitemap: indexItems,
		},
	};

	const xml = createXML(xmlObj);
	return xml;
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

function createXML(objToXml: Object): string {
	return xmlbuilder.create(objToXml, { encoding: 'UTF-8' }).end();
}
