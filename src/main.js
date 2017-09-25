/* @flow */
import type { Fetcher } from './fetching';
import type { Formatter } from './formatting';
import { PlainFormatter } from './formatting';

type Props = {
	fetchers: Fetcher<*, *>[],
	formatter: Formatter,
};

export type RawSiteMapData = {};

export default class Main {
	fetchers: Fetcher<*, *>[];
	formatter: Formatter;

	constructor({ fetchers, formatter }: Props) {
		this.fetchers = fetchers;
		this.formatter = formatter;
	}

	async run() {
		const data = await Promise.all(this.fetchers.map(f => f.getData()));

		return this.formatter.format(data);
	}
}
