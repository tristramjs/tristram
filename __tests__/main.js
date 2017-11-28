/* @flow */
import Main from '../src/main';
import type { Fetcher } from '../src/fetching';

class SyncFetcher implements Fetcher {
	getData() {
		return Promise.resolve({ loc: 'foooo' });
	}
}

describe('Main module', () => {
	const syncFetcher = new SyncFetcher();
	const formatter = {
		format: data => [ `<urlset><loc>${data[0].loc}</loc></urlset>` ],
	};
	const options = {
		hostname: 'http://foo.bar',
	};
	const main = new Main({
		fetchers: [ syncFetcher ],
		formatter,
		options,
	});

	it('should run without errors', async () => {
		const result = await main.run();

		expect(result).toEqual([ '<urlset><loc>foooo</loc></urlset>' ]);
	});

	it('should contain options', () => {
		const options = main.options;
		expect(options).toBe(options);
	});

	it('should contain default options', () => {
		expect(main.options.maxItemsPerSitemap).toBe(50000);
	});

	it('should overwrite default options', () => {
		const options = { hostname: 'http://foo.bar', maxItemsPerSitemap: 20000 };
		const main = new Main({ fetchers: [ syncFetcher ], formatter, options });
		expect(main.options.maxItemsPerSitemap).toBe(20000);
	});
});
