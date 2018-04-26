/* @flow */

// TODO:
// - formatter only has one property. Should we add some functionality from helper.js as formatter properties?
// - build an integrated pipeline with express
// - fix flow....

import type { RawSiteMapData } from '../types/sitemap';
import type { OptionsWithDefaults } from '../main';

import NewsSiteMapFormatter from './NewsSiteMap';

export interface Formatter {
	options: OptionsWithDefaults;
	format(data: RawSiteMapData[]): string[];
}

export type Props = {
	options: OptionsWithDefaults,
};

export default { NewsSiteMapFormatter };
