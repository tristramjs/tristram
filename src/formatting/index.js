/* @flow */

import type { RawSiteMapData, RawNewsSiteMapData } from '../types/sitemap';

import PlainFormatter from './Plain';
import NewsSiteMapFormatter from './NewsSiteMap';

export interface Formatter<FeedData> {
	xmlDeclaration: string;
	openingTag: string;
	closingTag: string;
	format(data: FeedData): string;
	formatIndex(data: any): string;
}

export interface SitemapFormatter extends Formatter<RawSiteMapData[]> {}

export interface NewsSiteFormatter extends Formatter<RawNewsSiteMapData[]> {}

export { PlainFormatter, NewsSiteMapFormatter };
