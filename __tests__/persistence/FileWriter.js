/* @flow */
import { exists, mkdir, readdir, unlink, rmdir } from '../../src/util/fs';
import FileWriter from '../../src/persistence/FileWriter';

const path = './tmp';

async function setup() {
	const folder = await exists(path);
	if (!folder) {
		await mkdir(path);
	}
}

async function cleanup() {
	const folder = await exists(path);
	if (folder) {
		const files = await readdir('./tmp');

		for (const file of files) {
			await unlink(`./tmp/${file}`);
		}

		await rmdir('./tmp');
	}
}

describe('FileWriter', () => {
	beforeAll(setup);

	it('write a sitemap in chunks to the file system', async () => {
		const fw = new FileWriter();
		await fw.createSitemap(`${process.cwd()}/tmp/bla.xml`);
		await fw.writeChunk({ foo: 'bar' });
		await fw.writeChunk({ baz: 'bar' });
		fw.commitSitemap();
	});

	afterAll(cleanup);
});
