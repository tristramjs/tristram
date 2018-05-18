/* @flow */

import type { RawSiteMapData, RawNewsSiteMapData } from '../types/sitemap';

import PlainFormatter from './Plain';
import NewsSiteMapFormatter from './NewsSiteMap';

export interface Formatter {
	xmlDeclaration: string;
	openingTag: string;
	closingTag: string;
	format(data: RawSiteMapData[]): string;
	formatIndex(data: any): string;
}

export interface NewsSiteFormatter extends Formatter {
	openingTagNews: string;
	closingTagNews: string;
	formatNews(data: RawNewsSiteMapData[]): string;
}

export { PlainFormatter, NewsSiteMapFormatter };
