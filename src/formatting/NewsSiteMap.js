/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawNewsSiteMapData } from '../types/sitemap';

import PlainFormatter from './Plain';
import newsSiteMapDataMapper from './formatNews';

import type { NewsSiteFormatter } from './index';

export default class NewsSiteMapFormatter extends PlainFormatter implements NewsSiteFormatter {
	openingTagNews = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" @xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';
	closingTagNews = '</urlset>';
	// eslint-disable-next-line class-methods-use-this
	formatNews(data: RawNewsSiteMapData[]): string {
		const mappedData = data.map(item => newsSiteMapDataMapper(item));
		return xmlbuilder.begin().ele(mappedData).end();
	}
}
