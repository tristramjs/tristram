/* @flow */

import type { RawSiteMapData, RawNewsSiteMapData } from '../types/sitemap';

export interface Formatter {
	format(data: RawSiteMapData[]): string;
	formatIndex(data: any): string;
}

export interface NewsSiteFormatter {
	format(data: RawSiteMapData[]): string;
	formatNews(data: RawNewsSiteMapData[]): string;
	formatIndex(data: any): string;
}
