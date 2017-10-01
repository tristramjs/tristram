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
	'image:image'?: {
		'image:loc': string,
		'image:caption'?: string,
		'image:geo_location'?: string,
		'image:title'?: string,
		'image:license'?: string,
	}[],
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
	if (item.image) {
		if (Array.isArray(item.image)) {
			updated['image:image'] = item.image.map(obj =>
				prefixKeysInObject(obj, 'image'),
			);
			delete updated.image;
		}
		if (typeof item.image === 'object' && !Array.isArray(item.image)) {
			updated['image:image'] = prefixKeysInObject(item.image, 'image');
			delete updated.image;
		}
	}
	// $FlowFixMe
	return updated;
}

function createXML(objToXml: Object): string {
	return xmlbuilder.create(objToXml, { encoding: 'UTF-8' }).end();
}

function prefixKeysInObject(obj: Object, prefix: string): Object {
	obj = Object.assign(
		// $FlowFixMe
		...Object.keys(obj).map(key => ({
			[`${prefix}:${key.toString()}`]: obj[key],
		})),
	);
	return obj;
}
