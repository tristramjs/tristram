/* @flow */
import fs from 'fs';

import Main from '../src/main';
import SyncFetcher from '../src/fetching/SyncFetcher';
import FileWriter from '../src/persistence/FileWriter';
import type { ChunkFetcher } from '../src/fetching/index';

describe('Main module', () => {
	beforeAll(() => {
		if (!fs.existsSync('./tmp')) {
			fs.mkdirSync('./tmp');
		}
	});

	it('should run without errors', async () => {
		const options = {
			hostname: 'http://foo.bar',
			maxItemsPerSitemap: 1,
		};

		const chunkFetcher: ChunkFetcher = {
			async* getDataChunk() {
				yield await Promise.resolve([ { loc: 'foo' } ]);
				yield await Promise.resolve([ { loc: 'bar' } ]);
				yield await Promise.resolve([ { loc: 'baz' } ]);
			},
		};

		const main = new Main({
			fetchers: [ new SyncFetcher({ data: [ { test: 'hello' } ] }), chunkFetcher ],
			writer: new FileWriter(),
			options,
		});
		const result = await main.run();

		expect(result).toEqual([ '<urlset><loc>foooo</loc></urlset>' ]);
	});

	// it('should overwrite default options', () => {
	// 	const main = new Main({
	// 		fetchers: [ syncFetcher ],
	// 		chunkFetchers: [],
	// 		writer: new FileWriter(),
	// 		options: { hostname: 'http://foo.bar', maxItemsPerSitemap: 20000 },
	// 	});
	// 	expect(main.options.maxItemsPerSitemap).toBe(20000);
	// });
});
