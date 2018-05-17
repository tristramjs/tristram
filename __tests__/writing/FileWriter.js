/* @flow */
import { setup, cleanup } from '../__testHelpers__/fs';
import { readdir } from '../../src/util/fs';
import FileWriter from '../../src/writing/FileWriter';

const path = `${process.cwd()}/FileWriterTest/`;

describe('FileWriter', () => {
	beforeAll(setup(path));

	it('write a sitemap in chunks to the file system', async () => {
		const fw = new FileWriter({ path });

		const openingTag = '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
		const closingTag = '</urlset>';
		const body1 = "[ { loc: 'foo' } ][ { loc: 'bar' } ]";
		const body2 = "[ { loc: 'baz' } ][ { loc: 'quux' } ]";

		await fw.write('aa', [ openingTag, body1, closingTag ].join(''));
		await fw.write('bb', [ openingTag, body2, closingTag ].join(''));

		const files = await readdir(path);
		expect(files.length).toBe(2);
	});

	afterAll(cleanup(path));
});
