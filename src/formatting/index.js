/* @flow */

// IDEA:
// class VanillaFormatter {}
//
// class NewsSiteMapFormatter extends VanillaFormatter {}

import type { RawSiteMapData, Options } from '../main';
import { siteMapDataMapper, createSitemap } from './helper';
import type { MappedSiteMapData } from './helper';
import xmlbuilder from 'xmlbuilder';

export interface Formatter<Options> {
	format(data: RawSiteMapData[]): string[],
}

type Props = {
	options: Options,
};

export default class PlainFormatter implements Formatter<Options> {
	options: Options;

	constructor({ options }: Props) {
		this.options = options;
	}

	format(data: RawSiteMapData[]): string[] {
		// $FlowFixMe
		data = data.map(item => siteMapDataMapper(item));

		// $FlowFixMe
		return [createSitemap(data)];
	}
}
