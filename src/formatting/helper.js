/* @flow */

import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData, RawNewsSiteMapData } from '../main';

export type MappedSiteMapData = {
	loc: string,
	lastmod?: string,
	priority?: number,
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
	'image:image'?: {
		'image:loc': string,
		'image:caption'?: string,
		'image:geo_location'?: string,
		'image:title'?: string,
		'image:license'?: string,
	}[],
	'video:video'?: {
		'video:thumbnail_loc': string,
		'video:title': string,
		'video:description': string,
		'video:content_loc'?: string,
		'video:player_loc'?: string,
		'video:duration'?: string,
		'video:expiration_date'?: string,
		'video:rating'?: number,
		'video:view_count'?: number,
		'video:publication_date'?: string,
		'video:family_friendly'?: string,
		'video:category'?: string,
		'video:restriction'?: string, // details read: https://developers.google.com/webmasters/videosearch/sitemaps
		'video:gallery_loc'?: string,
		'video:price'?: string,
		'video:requires_subscription'?: string,
		'video:uploader'?: string,
		'video:platform'?: string,
		'video:live'?: string,
	}[],
};

export type MappedNewsSiteMapData = {
	loc: string,
	'news:news': {
		'news:publication': {
			'news:name': string,
			'news:language': string,
		},
		'news:genres'?: string | string[],
		'news:publication_date': string,
		'news:title': string,
		'news:keywords'?: string | string[],
		'news:stock_tickers'?: string | string[],
	},
};

export function createSitemap(data: MappedSiteMapData[]): string {
	const xmlObj = {
		urlset: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			'@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
			'@xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
			url: data,
		},
	};
	const xml = createXML(xmlObj);
	return xml;
}

export function createNewsSitemap(data: MappedNewsSiteMapData[]): string {
	const xmlObj = {
		urlset: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			'@xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
			url: data,
		},
	};
	const xml = createXML(xmlObj);
	return xml;
}

export function createIndexSitemap(numberSitemaps: number, hostname: string, path: string): string {
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

export function siteMapDataMapper(item: RawSiteMapData): MappedSiteMapData {
	const updated = { ...item };

	if (item.lastmod) {
		updated.lastmod = item.lastmod.toISOString();
	}
	if (item.image) {
		if (Array.isArray(item.image)) {
			updated['image:image'] = item.image.map(obj => prefixKeysInObject(obj, 'image'));
			delete updated.image;
		}
		if (typeof item.image === 'object' && !Array.isArray(item.image)) {
			updated['image:image'] = prefixKeysInObject(item.image, 'image');
			delete updated.image;
		}
	}
	if (item.video) {
		if (Array.isArray(item.video)) {
			// fix all datatypes
			item.video.map(obj => {
				if (obj.expiration_date) {
					// $FlowFixMe
					obj.expiration_date = obj.expiration_date.toISOString();
				}
				if (obj.publication_date) {
					// $FlowFixMe
					obj.publication_date = obj.publication_date.toISOString();
				}
				if (obj.family_friendly !== null || obj.family_friendly !== undefined) {
					// $FlowFixMe
					obj.family_friendly = boolToText(obj.family_friendly);
				}
				if (obj.requires_subscription !== null || obj.requires_subscription !== undefined) {
					// $FlowFixMe
					obj.requires_subscription = boolToText(obj.requires_subscription);
				}
				if (obj.live !== null || obj.live !== undefined) {
					// $FlowFixMe
					obj.live = boolToText(obj.live);
				}
				return obj;
			});
			// prefix keys
			// $FlowFixMe
			updated['video:video'] = item.video.map(obj => prefixKeysInObject(obj, 'video'));
			delete updated.video;
		}
		if (typeof item.video === 'object' && !Array.isArray(item.video)) {
			// fix all datatypes
			if (item.video.expiration_date) {
				// $FlowFixMe
				item.video.expiration_date = item.video.expiration_date.toISOString();
			}
			if (item.video.publication_date) {
				// $FlowFixMe
				item.video.publication_date = item.video.publication_date.toISOString();
			}
			if (item.video.family_friendly !== null || item.video.family_friendly !== undefined) {
				// $FlowFixMe
				item.video.family_friendly = boolToText(item.video.family_friendly);
			}
			if (item.video.requires_subscription !== null || item.video.requires_subscription !== undefined) {
				// $FlowFixMe
				item.video.requires_subscription = boolToText(item.video.requires_subscription);
			}
			if (item.video.live !== null || item.video.live !== undefined) {
				// $FlowFixMe
				item.video.live = boolToText(item.video.live);
			}
			//prefix keys
			updated['video:video'] = prefixKeysInObject(item.video, 'video');
			delete updated.video;
		}
	}
	// $FlowFixMe
	return updated;
}

export function newsSiteMapDataMapper(item: RawNewsSiteMapData): MappedNewsSiteMapData {
	const updated = { ...item };
	if (item.news) {
		if (item.news.publication) {
			updated.news.publication = prefixKeysInObject(item.news.publication, 'news');
		}
		if (item.news.publication_date) {
			item.news.publication_date = item.news.publication_date.toISOString();
		}
		if (item.news.genres && Array.isArray(item.news.genres)) {
			item.news.genres = item.news.genres.join(', ');
		}
		if (item.news.keywords && Array.isArray(item.news.keywords)) {
			item.news.keywords = item.news.keywords.join(', ');
		}
		if (item.news.stock_tickers && Array.isArray(item.news.stock_tickers)) {
			item.news.stock_tickers = item.news.stock_tickers.join(', ');
		}
		updated['news:news'] = prefixKeysInObject(item.news, 'news');
		delete updated.news;
	}

	return updated;
}

export function createXML(objToXml: Object): string {
	return xmlbuilder.create(objToXml, { encoding: 'UTF-8' }).end();
}

export function prefixKeysInObject(obj: Object, prefix: string): Object {
	obj = Object.assign(
		// $FlowFixMe
		...Object.keys(obj).map(key => ({
			[`${prefix}:${key.toString()}`]: obj[key],
		}))
	);
	return obj;
}

export function boolToText(bool: boolean): string {
	if (bool) {
		return 'yes';
	}
	return 'no';
}
