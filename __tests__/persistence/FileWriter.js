/* @flow */
import fs from 'fs';

import FileWriter from '../../src/persistence/FileWriter';

describe('FileWriter', () => {
	beforeAll(() => {
		if (!fs.existsSync('./tmp')) {
			fs.mkdirSync('./tmp');
		}
	});

	it('write a sitemap in chunks to the file system', async () => {
		const fw = new FileWriter();
		await fw.createSitemap(`${process.cwd()}/tmp/bla.xml`);
		[ { foo: 'bar' }, { baz: 'bar' } ].forEach(data => fw.writeChunk(data));
		fw.commitSitemap();
	});

	afterAll(() => {
		// fs.unlink(`${process.cwd()}/tmp/bla.xml`);
	});
});
