/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawNewsSiteMapData } from '../types/sitemap';

import newsSiteMapDataMapper from './formatNews';
import createIndexSitemap from './formatIndex';

import type { NewsSiteFormatter } from './index';


export default class NewsSiteMapFormatter implements NewsSiteFormatter {
	xmlDeclaration = '<?xml version="1.0"?>';
	openingTag = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" @xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';
	closingTag = '</urlset>';
	// eslint-disable-next-line class-methods-use-this
	format(data: RawNewsSiteMapData[]): string {
		const mappedData = data.map(item => newsSiteMapDataMapper(item));
		return xmlbuilder.begin().ele(mappedData).end();
	}

	// eslint-disable-next-line class-methods-use-this
	formatIndex(data: any): string {
		const { path, hostname, numberSitemaps } = data;
		const xml = createIndexSitemap(numberSitemaps, hostname, path);
		return xmlbuilder.create(xml, { encoding: 'UTF-8' }).end();
	}
}
