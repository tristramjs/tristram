/* @flow */
import AWS from 'aws-sdk';

import type { Writer, Path } from './index';

type Props = {
	Bucket: string,
	Key: string,
	apiVersion: string,
	region: string,
	secretAccessKey: string,
	accessKeyId: string,
};

export default class S3Writer implements Writer {
	putObject: (body: any) => Promise<any>;
	Key: string;
	cache = '';
	sitemaps: number = 0;

	constructor({
		Bucket, Key, apiVersion, region, accessKeyId, secretAccessKey,
	}: Props) {
		const s3 = new AWS.S3({
			endpoint: 'http://10.2.11.162:9000',
			accessKeyId,
			secretAccessKey,
			s3ForcePathStyle: true,
			signatureVersion: 'v4',
		});

		this.Key = Key;

		this.putObject = body => s3.putObject({ ...body, Bucket }).promise();
	}

	async createSitemap(xmlDeclaration: string, openingTag: string): Promise<Path> {
		await this.writeChunk(xmlDeclaration + openingTag);
		return this.getSitemapPath();
	}

	async writeChunk(data: string): Promise<void> {
		this.cache = this.cache + data;
	}

	async commitSitemap(closingTag: string): Promise<void> {
		await this.putObject({ Key: this.getSitemapPath(), Body: this.cache + closingTag });
		this.sitemaps = this.sitemaps + 1;
		this.cache = '';
	}

	async createIndexSitemap(data: string): Promise<void> {
		await this.putObject({ Key: `${this.Key}indexSitemap.xml`, Body: data });
	}

	getSitemapPath(): string {
		return `${this.Key}-${this.sitemaps}.xml`;
	}
}
