/* @flow */
import { setup, cleanup } from '../__testHelpers__/fs';
import { readdir } from '../../src/util/fs';
import FileWriter from '../../src/persistence/FileWriter';

const path = `${process.cwd()}/FileWriterTest/`;

describe('FileWriter', () => {
	beforeAll(setup(path));

	it('write a sitemap in chunks to the file system', async () => {
		const fw = new FileWriter({ path, fileName: 'bla' });

		await fw.createSitemap('<?xml version="1.0"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		await fw.writeChunk("[ { loc: 'foo' } ]");
		await fw.writeChunk("[ { loc: 'bar' } ]");
		await fw.commitSitemap('</urlset>');

		await fw.createSitemap('<?xml version="1.0"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		await fw.writeChunk("[ { loc: 'baz' } ]");
		await fw.writeChunk("[ { loc: 'quux' } ]");
		await fw.commitSitemap('</urlset>');

		const files = await readdir(path);
		expect(files.length).toBe(2);
	});

	afterAll(cleanup(path));
});
