/* @flow */
import AWS from 'aws-sdk';

import type { RawSiteMapData } from '../types/sitemap';

import appendToXml from './appendToXml';

import type { Writer } from './index';

type Props = {
	Bucket: string,
	Key: string,
	apiVersion: string,
	region: string,
};

export default class S3Writer implements Writer {
	completeMultipartUpload: Function;
	createMultipartUpload: Function;
	uploadPart: Function;

	sitemap: AsyncGenerator<void, void, RawSiteMapData[]>;

	constructor({
		Bucket, Key, apiVersion, region,
	}: Props) {
		const s3 = new AWS.S3({ apiVersion, region });
		const params = { Bucket, Key };

		this.completeMultipartUpload = body => s3.completeMultipartUpload({ ...params, body }).promise();
		this.createMultipartUpload = body => s3.createMultipartUpload({ ...params, body }).promise();
		this.uploadPart = body => s3.uploadPart({ ...params, body }).promise();
	}

	async createSitemap(path: string) {
		await this.createMultipartUpload(path);
		this.sitemap = appendToXml(data => this.writeChunk(data));
	}

	async writeChunk(data: RawSiteMapData[]) {
		if (this.sitemap) {
			await this.sitemap.next(data);
		} else {
			throw new Error('Cant write to file. Did you forget to call/await `createSitemap`?');
		}
	}

	async commitSitemap() {
		if (this.sitemap) {
			await this.sitemap.return();
		} else {
			throw new Error('Cant write to file. Did you forget to call/await `createSitemap`?');
		}
	}
}
