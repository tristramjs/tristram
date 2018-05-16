/* @flow */
import { setup, cleanup } from '../__testHelpers__/fs';
import { readdir } from '../../src/util/fs';
import FileWriter from '../../src/persistence/FileWriter';

const path = `${process.cwd()}/FileWriterTest/`;

describe('FileWriter', () => {
	beforeAll(setup(path));

	it('write a sitemap in chunks to the file system', async () => {
		const fw = new FileWriter({ path, fileName: 'bla' });

		await fw.createSitemap('<?xml version="1.0"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', 0);
		await fw.writeChunk("[ { loc: 'foo' } ]", 0);
		await fw.writeChunk("[ { loc: 'bar' } ]", 0);
		await fw.commitSitemap('</urlset>', 0);

		await fw.createSitemap('<?xml version="1.0"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', 1);
		await fw.writeChunk("[ { loc: 'baz' } ]", 1);
		await fw.writeChunk("[ { loc: 'quux' } ]", 1);
		await fw.commitSitemap('</urlset>', 1);

		const files = await readdir(path);
		expect(files.length).toBe(2);
	});

	afterAll(cleanup(path));
});
