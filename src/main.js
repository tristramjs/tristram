/* @flow */
import type { Fetcher } from './fetching';
import type { Formatter } from './formatting';
import PlainFormatter from './formatting';

type Props = {
	fetchers: Fetcher<*, *>[],
	formatter: Formatter<Options>,
	options: Options,
};

export type Options = {
	hostname: string,
	path?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
};

type OptionsWithDefaults = {
	hostname: string,
	cacheTime?: number,
	maxItemsPerSitemap: number,
};

export type RawSiteMapData = {
	loc: string,
	lastmod?: Date,
	priority?: number,
	changefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never',
};

export default class Main {
	fetchers: Fetcher<*, *>[];
	formatter: Formatter<Options>;
	options: Options;

	constructor({ fetchers, formatter, options }: Props) {
		this.fetchers = fetchers;
		this.formatter = formatter;
		this.options = ({
			maxItemsPerSitemap: (50000: number),
			...options,
			// $FlowFixMe
		}: OptionsWithDefaults);
	}

	async run() {
		const data = await Promise.all(this.fetchers.map(f => f.getData()));

		// $FlowFixMe
		return this.formatter.format(data);
	}
}
