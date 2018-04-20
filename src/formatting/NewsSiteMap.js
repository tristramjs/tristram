/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawNewsSiteMapData } from '../types/sitemap';

import PlainFormatter from './Plain';
import newsSiteMapDataMapper from './formatNews';

import type { NewsSiteFormatter } from './index';

export default class NewsSiteMapFormatter extends PlainFormatter implements NewsSiteFormatter {
	// eslint-disable-next-line class-methods-use-this
	formatNews(data: RawNewsSiteMapData[]): string {
		const mappedData = data.map(item => newsSiteMapDataMapper(item));
		return xmlbuilder.begin().ele(mappedData).end();
	}
}
