/* @flow */
import type { Fetcher } from '../../src/fetching/index';
import SitemapGenerator from '../../src/generation/SitemapGenerator';
import SyncFetcher from '../../src/fetching/SyncFetcher';
import PlainFormatter from '../../src/formatting/Plain';
import InMemoryWriter from '../../src/writing/InMemoryWriter';

const fooFetcher: Fetcher<*> = new SyncFetcher({
	data: [ { loc: 'foo' }, { loc: 'bar' }, { loc: 'qak' } ],
});

const barFetcher: Fetcher<*> = new SyncFetcher({
	data: [ { loc: 'Brrrr' } ],
});

const bazFetcher: Fetcher<*> = new SyncFetcher({
	data: [ { loc: 'rrrbbbbB' }, { loc: 'aksjaskjf' } ],
});

const qakFetcher: Fetcher<*> = new SyncFetcher({
	data: [ { loc: 'Rhabarber' }, { loc: 'Rucola' }, { loc: 'Skoda' }, { loc: 'Petersilie' }, { loc: 'Rindsgulasch' } ],
});

describe('SitemapGenerator module', () => {
	[
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher, barFetcher, bazFetcher ], result: 4 },
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher, bazFetcher ], result: 4 },
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher ], result: 3 },
		{ maxItemsPerSitemap: 2, fetchers: [ barFetcher ], result: 2 },
		{ maxItemsPerSitemap: 2, fetchers: [ bazFetcher ], result: 2 },
		{ maxItemsPerSitemap: 2, fetchers: [ qakFetcher, bazFetcher ], result: 5 },
		{ maxItemsPerSitemap: 1, fetchers: [ qakFetcher, bazFetcher ], result: 8 },
	].map(({ maxItemsPerSitemap, fetchers, result }) =>
		it('should run without errors', async () => {
			const options = { hostname: 'foo.bar', maxItemsPerSitemap };

			const writer = new InMemoryWriter();

			const main = new SitemapGenerator({
				fetchers,
				formatter: new PlainFormatter(),
				writer,
				options,
			});

			const sitemaps = await main.run();

			expect(sitemaps).toMatchSnapshot();
			expect(sitemaps.length).toBe(result);
		}));
});
