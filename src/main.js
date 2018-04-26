/* @flow */
import type { ChunkFetcher } from './fetching';
import type { Writer } from './persistence/index';
import type { RawSiteMapData } from './types/sitemap';

export type Options = {
	hostname: string,
	path?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
};

type Props = {
	fetchers: ChunkFetcher[],
	// formatter types..
	formatter: any,
	options: Options,
	writer: Writer,
};

export type OptionsWithDefaults = {
	hostname: string,
	cacheTime?: number,
	maxItemsPerSitemap: number,
	path: string,
};

type Sitemap = string;

export default class Main {
	fetchers: ChunkFetcher[];
	formatter: any;
	options: OptionsWithDefaults;
	writer: Writer;
	sitemaps: Sitemap[];
	currentItemCount: number;

	constructor({
		fetchers, formatter, options, writer,
	}: Props) {
		this.fetchers = fetchers;
		this.formatter = formatter;
		this.writer = writer;
		this.sitemaps = [];
		this.currentItemCount = 0;

		this.options = {
			maxItemsPerSitemap: 50000,
			...options,
		};
	}

	async run() {
		await this.createSitemap();

		for (const fetcher of this.fetchers) {
			for await (const data of fetcher.getData()) {
				// Format data here @Bernd, to fix tests

				await this.saveChunk(this.formatter.format(data));
			}
		}

		await this.writer.commitSitemap();

		// create index sitemap @Bernd
	}

	async saveChunk(data: RawSiteMapData[]) {
		if (this.currentItemCount > this.options.maxItemsPerSitemap - 1) {
			await this.writer.commitSitemap();
			await this.createSitemap();
			this.currentItemCount = 0;
		}
		await this.writeChunk(data);
	}

	async createSitemap() {
		try {
			const path = await this.writer.createSitemap();
			this.sitemaps.push(path);
		} catch (err) {
			console.error('Could not create sitemap!');
			console.error(err);
		}
	}

	async writeChunk(data: RawSiteMapData[]) {
		await this.writer.writeChunk(data);
		this.currentItemCount = this.currentItemCount + data.length;
	}
}
