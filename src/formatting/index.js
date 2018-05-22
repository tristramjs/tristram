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

export interface NewsSiteFormatter {
	xmlDeclaration: string;
	openingTag: string;
	closingTag: string;
	format(data: RawNewsSiteMapData[]): string;
	formatIndex(data: any): string;
}

export { PlainFormatter, NewsSiteMapFormatter };
