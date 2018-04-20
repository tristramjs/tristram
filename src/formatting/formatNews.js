// @flow
import type { RawNewsSiteMapData, MappedNewsSiteMapData } from '../types/sitemap';

import { prefixKeysInObject } from './format';

export default function newsSiteMapDataMapper(item: RawNewsSiteMapData): MappedNewsSiteMapData {
	const updated = { ...item };
	if (item.news) {
		if (item.news.publication) {
			updated.news.publication = prefixKeysInObject(item.news.publication, 'news');
		}
		if (item.news.publication_date) {
			// $FlowFixMe
			updated.news.publication_date = item.news.publication_date.toISOString();
		}
		if (item.news.genres && Array.isArray(item.news.genres)) {
			// $FlowFixMe
			updated.news.genres = item.news.genres.join(', ');
		}
		if (item.news.keywords && Array.isArray(item.news.keywords)) {
			updated.news.keywords = item.news.keywords.join(', ');
		}
		if (item.news.stock_tickers && Array.isArray(item.news.stock_tickers)) {
			updated.news.stock_tickers = item.news.stock_tickers.join(', ');
		}
		updated['news:news'] = prefixKeysInObject(item.news, 'news');
		delete updated.news;
	}

	return updated;
}

/*

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
*/
