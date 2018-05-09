/* @flow */
import type { ChunkFetcher } from './fetching';
import type { Writer } from './persistence/index';
import type { RawSiteMapData } from './types/sitemap';

// options management? We have several Modules who needs to know about options
export type Options = {
	hostname: string,
	path?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
	maxItemsPerIndexSitemap?: number,
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
	maxItemsPerIndexSitemap: number,
	path?: string,
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
			maxItemsPerIndexSitemap: 50000,
			...options,
		};
	}

	async run() {
		await this.createSitemap();

		for (const fetcher of this.fetchers) {
			for await (const data of fetcher.getData()) {
				await this.saveChunk(data);
			}
		}

		await this.writer.commitSitemap(this.formatter.closingTag);

		await this.createIndexSitemap();
	}

	async saveChunk(data: RawSiteMapData[]) {
		// problem / bug when chunk from fetchers.getData() is bigger than
		// options.maxItemsPerSitemap! The if-statement below does not cover that!
		// Especially relevant for SyncFetcher
		if (this.currentItemCount > this.options.maxItemsPerSitemap - 1) {
			await this.writer.commitSitemap(this.formatter.closingTag);
			await this.createSitemap();
			this.currentItemCount = 0;
		}
		await this.writeChunk(data);
	}

	async createSitemap() {
		try {
			const { xmlDeclaration, openingTag } = this.formatter;
			const path = await this.writer.createSitemap(xmlDeclaration, openingTag);
			this.sitemaps.push(path);
		} catch (err) {
			/* eslint-disable no-console */
			console.error('Could not create sitemap!');
			console.error(err);
			/* eslint-enable no-console */
		}
	}

	async writeChunk(data: RawSiteMapData[]) {
		const formatted = this.formatter.format(data);
		await this.writer.writeChunk(formatted);

		this.currentItemCount = this.currentItemCount + data.length;
	}

	async createIndexSitemap() {
		const numberIndexSitemaps = Math.ceil(this.sitemaps.length / this.options.maxItemsPerIndexSitemap);
		for (let index = 0; index < numberIndexSitemaps; index = index + 1) {
			try {
				// writer path is wrong!?
				const path = this.options.path || this.writer.getPath();
				const { hostname } = this.options;
				const numberSitemaps = this.sitemaps.length;
				const indexSitemap = this.formatter.formatIndex({ path, hostname, numberSitemaps });
				await this.writer.createIndexSitemap(indexSitemap);
			} catch (err) {
				/* eslint-disable no-console */
				console.error('Could not create index sitemaps!');
				console.error(err);
				/* eslint-enable no-console */
			}
		}
	}
}
