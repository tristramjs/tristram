/* @flow */

import S3Writer from '../../src/persistence/S3Writer';

describe('test', () => {
	it('should work', async () => {
		const xx = new S3Writer({
			Bucket: 'blerb',
			Key: 'sitemap',
			accessKeyId: 'L6N2ECH0CP2WYR8PN5N8',
			secretAccessKey: '0q9mXP9jLLxGBtnB19yLSOeQ4nQbOctgv9MTkD9e',
		});

		await xx.createSitemap('<?xml version="1.0"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		await xx.writeChunk('<loc>foo</loc>');
		await xx.writeChunk('<loc>bar</loc>');
		await xx.writeChunk('<loc>baz</loc>');
		await xx.writeChunk('<loc>quux</loc>');
		await xx.commitSitemap('</urlset>');
	});
});
