/* @flow */

import type { RawSiteMapData } from '../types/sitemap';
import type { OptionsWithDefaults } from '../main';

import NewsSiteMapFormatter from './NewsSiteMap';

export interface Formatter {
	format(data: RawSiteMapData[]): string;
	formatIndex(data: any): string;
}

export default { NewsSiteMapFormatter };
