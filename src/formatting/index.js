/* @flow */

// IDEA:
// class VanillaFormatter {}
//
// class NewsSiteMapFormatter extends VanillaFormatter {}

import type { RawSiteMapData } from '../main';

export interface Formatter {
	format(data: RawSiteMapData[]): string,
}

export class PlainFormatter implements Formatter {
	constructor() {}

	format(data: RawSiteMapData[]) {
		return 'foobar';
	}
}
