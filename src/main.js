/* @flow */
import type { Fetcher } from './fetching';
import type { Formatter } from './formatting';
import PlainFormatter from './formatting';

type Props = {
	fetchers: Fetcher[],
	formatter: Formatter<Options>,
	options: Options,
};

export type Options = {
	hostname: string,
	path?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
};

export type OptionsWithDefaults = {
	hostname: string,
	cacheTime?: number,
	maxItemsPerSitemap: number,
	path: string,
};

export type imageData = {
	loc: string,
	caption?: string,
	geo_location?: string,
	title?: string,
	license?: string,
};

export type videoData = {
	thumbnail_loc: string,
	title: string,
	description: string,
	content_loc?: string,
	player_loc?: string,
	duration?: string,
	expiration_date?: Date,
	rating?: number,
	view_count?: number,
	publication_date?: Date,
	family_friendly?: boolean,
	category?: string,
	restriction?: string, // details read: https://developers.google.com/webmasters/videosearch/sitemaps
	gallery_loc?: string,
	price?: string,
	requires_subscription?: boolean,
	uploader?: string,
	platform?: string,
	live?: boolean,
};

export type RawSiteMapData = {
	loc: string,
	lastmod?: Date,
	priority?: number,
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
	image?: imageData[],
	video?: videoData[],
};

export default class Main {
	fetchers: Fetcher[];
	formatter: Formatter<Options>;
	options: Options;

	constructor({ fetchers, formatter, options }: Props) {
		this.fetchers = fetchers;
		this.formatter = formatter;
		this.options = ({
			maxItemsPerSitemap: (50000: number),
			path: 'sitemaps',
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
