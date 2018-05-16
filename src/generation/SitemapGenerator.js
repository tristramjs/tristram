/* @flow */
import type { Fetcher } from '../fetching';
import type { Writer } from '../persistence';
import type { Formatter } from '../formatting';
import type { RawSiteMapData } from '../types/sitemap';
import chunk from '../util/chunk';

// options management? We have several Modules who needs to know about options
export type Options = {
	hostname: string,
	publicPath?: string,
	cacheTime?: number,
	maxItemsPerSitemap?: number,
	maxItemsPerIndexSitemap?: number,
};

type Props = {
	fetchers: Fetcher[],
	// formatter types..
	formatter: Formatter,
	options: Options,
	writer: Writer,
};

export type OptionsWithDefaults = {
	hostname: string,
	cacheTime?: number,
	maxItemsPerSitemap: number,
	maxItemsPerIndexSitemap: number,
};

type Sitemap = string;

export default class SitemapGenerator {
	fetchers: Fetcher[];
	formatter: Formatter;
	options: OptionsWithDefaults;
	writer: Writer;
	sitemaps: Sitemap[];
	publicPath: string;

	buffer = [];

	constructor({
		fetchers, formatter, options, writer,
	}: Props) {
		this.fetchers = fetchers;
		this.formatter = formatter;
		this.writer = writer;
		this.sitemaps = [];
		this.publicPath = options.publicPath || '';

		this.options = {
			maxItemsPerSitemap: 50000,
			maxItemsPerIndexSitemap: 50000,
			...options,
		};
	}

	async run() {
		for (const fetcher of this.fetchers) {
			for await (const data of fetcher.getData()) {
				await this.saveChunk(data);
			}
		}

		if (this.buffer.length > 0) {
			await this.commitCompleteSitemap(this.buffer);
			this.buffer = [];
		}

		await this.createIndexSitemap();
	}

	async saveChunk(data: RawSiteMapData[]) {
		const { options: { maxItemsPerSitemap } } = this;
		if (this.buffer.length + data.length < maxItemsPerSitemap) {
			this.buffer = this.buffer.concat(data);
		} else if (this.buffer.length + data.length === maxItemsPerSitemap) {
			await this.commitCompleteSitemap(this.buffer.concat(data));
			this.buffer = [];
		} else if (this.buffer.length + data.length > maxItemsPerSitemap) {
			// 1. get a chunk of the new data such that (currentItemCount + dataChunk.length == maxItemsPerSitemap)
			// so it can be flushed out to the writer
			const { length: bufferLength } = this.buffer;
			const firstChunk = data.slice(0, maxItemsPerSitemap - bufferLength);
			await this.commitCompleteSitemap(this.buffer.concat(firstChunk));
			this.buffer = [];

			// 2. for all chunks where (chunk.length == maxItemsPerSitemap), flush out to Writer
			const [ lastChunk, ...otherChunks ] = chunk(
				data.slice(maxItemsPerSitemap - bufferLength),
				maxItemsPerSitemap
			).reverse();

			for (const part of otherChunks) {
				await this.commitCompleteSitemap(part);
			}

			// 3. if the final chunk is (finalChunk.length < maxItemsPerSitemap),
			// create a new sitemap and flush the (incomplete) data chunk ELSE just save the complete sitemap
			if (lastChunk.length < maxItemsPerSitemap) {
				this.buffer = this.buffer.concat(lastChunk);
			} else if (lastChunk.length === maxItemsPerSitemap) {
				await this.commitCompleteSitemap(lastChunk);
			}
		}
	}

	async commitCompleteSitemap(data: RawSiteMapData[]) {
		await this.createSitemap();
		await this.writer.writeChunk(this.formatter.format(data), this.sitemaps.length - 1);
		await this.writer.commitSitemap(this.formatter.closingTag, this.sitemaps.length - 1);
	}

	async createSitemap() {
		const { xmlDeclaration, openingTag } = this.formatter;
		const path = await this.writer.createSitemap(xmlDeclaration, openingTag, this.sitemaps.length);
		this.sitemaps.push(path);
	}

	async createIndexSitemap() {
		const numberIndexSitemaps = Math.ceil(this.sitemaps.length / this.options.maxItemsPerIndexSitemap);
		const { hostname } = this.options;
		const numberSitemaps = this.sitemaps.length;

		for (let index = 0; index <= numberIndexSitemaps; index = index + 1) {
			const indexSitemap = this.formatter.formatIndex({ path: this.publicPath, hostname, numberSitemaps });
			await this.writer.createIndexSitemap(indexSitemap);
		}
	}
}