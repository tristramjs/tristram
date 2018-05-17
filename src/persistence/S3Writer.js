/* @flow */
import AWS from 'aws-sdk';

import type { Writer } from './index';

type Props = {
	Bucket: string,
	endpoint: string,
	apiVersion: string,
	region: string,
	secretAccessKey: string,
	accessKeyId: string,
};

export default class S3Writer implements Writer {
	putObject: (body: any) => Promise<any>;

	constructor({
		Bucket, endpoint, apiVersion, region, accessKeyId, secretAccessKey,
	}: Props) {
		const s3 = new AWS.S3({
			endpoint,
			accessKeyId,
			secretAccessKey,
			region,
			apiVersion,
			s3ForcePathStyle: true,
			signatureVersion: 'v4',
		});

		this.putObject = body => s3.putObject({ ...body, Bucket }).promise();
	}

	async write(key: string, data: string) {
		await this.putObject({ Key: key, Body: data });
		return key;
	}
}
