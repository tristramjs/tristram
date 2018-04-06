/* @flow */
import type { ChunkFetcher } from './fetching';
import type { Writer } from './persistence/index';
import type { RawSiteMapData } from './types/sitemap';
import FileWriter from './persistence/FileWriter';

export type Options = {
	hostname: string,
	path?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
};

type Props = {
	fetchers: ChunkFetcher[],
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
	options: OptionsWithDefaults;
	writer: Writer;
	sitemaps: Sitemap[];
	currentItemCount: number;

	constructor({ fetchers, options, writer }: Props) {
		this.fetchers = fetchers;
		this.writer = writer || new FileWriter();
		this.sitemaps = [];
		this.currentItemCount = 0;

		this.options = {
			maxItemsPerSitemap: 50000,
			...options,
		};
	}

	async run() {
		await this.createSitemap(`${process.cwd()}/tmp2/sitemap-0.xml`);

		for (const fetcher of this.fetchers) {
			for await (const data of fetcher.getData()) {
				for (const sitemapData of data) {
					await this.saveChunk(sitemapData);
				}
			}
		}

		await this.writer.commitSitemap();
	}

	async saveChunk(data: RawSiteMapData) {
		if (this.currentItemCount > this.options.maxItemsPerSitemap - 1) {
			await this.writer.commitSitemap();
			await this.createSitemap(`${process.cwd()}/tmp2/sitemap-${this.sitemaps.length}.xml`);
			this.currentItemCount = 0;
		}
		await this.writeChunk(data);
	}

	async createSitemap(path: string) {
		try {
			await this.writer.createSitemap(path);
			this.sitemaps.push(path);
		} catch (err) {
			console.error('Could not create sitemap!');
			console.error(err);
		}
	}

	async writeChunk(data: RawSiteMapData) {
		await this.writer.writeChunk(data);
		this.currentItemCount = this.currentItemCount + 1;
	}
}
