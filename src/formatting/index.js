/* @flow */

import type { RawSiteMapData, RawNewsSiteMapData } from '../types/sitemap';

export interface Formatter {
	xmlDeclaration: string;
	openingTag: string;
	closingTag: string;
	format(data: RawSiteMapData[]): string;
	formatIndex(data: any): string;
}

export interface NewsSiteFormatter extends Formatter {
	formatNews(data: RawNewsSiteMapData[]): string;
}
