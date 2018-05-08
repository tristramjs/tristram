/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData } from '../types/sitemap';

import { siteMapDataMapper } from './format';
import createIndexSitemap from './formatIndex';

import type { Formatter } from './index';

export default class PlainFormatter implements Formatter {
	xmlDeclaration = '<?xml version="1.0"?>';
	openingTag = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
	closingTag = '</urlset>';

	// eslint-disable-next-line class-methods-use-this
	format(data: RawSiteMapData[]): string {
		const mappedData = data.map(item => siteMapDataMapper(item));
		return xmlbuilder
			.begin()
			.ele(mappedData)
			.end();
	}

	// eslint-disable-next-line class-methods-use-this
	formatIndex(data: any): string {
		const { path, hostname, numberSitemaps } = data;
		const xml = createIndexSitemap(numberSitemaps, hostname, path);
		return xmlbuilder.create(xml, { encoding: 'UTF-8' }).end();
	}
}
