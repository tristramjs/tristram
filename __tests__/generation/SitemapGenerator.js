/* @flow */
import SitemapGenerator from '../../src/generation/SitemapGenerator';
import SyncFetcher from '../../src/fetching/SyncFetcher';
import PlainFormatter from '../../src/formatting/Plain';
import InMemoryWriter from '../../src/persistence/InMemoryWriter';

const fooFetcher = new SyncFetcher({
	data: [ { loc: 'foo' }, { loc: 'bar' }, { loc: 'qak' } ],
});

const barFetcher = new SyncFetcher({
	data: [ { loc: 'Brrrr' } ],
});

const bazFetcher = new SyncFetcher({
	data: [ { loc: 'rrrbbbbB' }, { loc: 'aksjaskjf' } ],
});

const qakFetcher = new SyncFetcher({
	data: [ { loc: 'Rhabarber' }, { loc: 'Rucola' }, { loc: 'Skoda' }, { loc: 'Petersilie' }, { loc: 'Rindsgulasch' } ],
});

describe('SitemapGenerator module', () => {
	[
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher, barFetcher, bazFetcher ], result: 3 },
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher, bazFetcher ], result: 3 },
		{ maxItemsPerSitemap: 2, fetchers: [ fooFetcher ], result: 2 },
		{ maxItemsPerSitemap: 2, fetchers: [ barFetcher ], result: 1 },
		{ maxItemsPerSitemap: 2, fetchers: [ bazFetcher ], result: 1 },
		{ maxItemsPerSitemap: 2, fetchers: [ qakFetcher, bazFetcher ], result: 4 },
		{ maxItemsPerSitemap: 1, fetchers: [ qakFetcher, bazFetcher ], result: 7 },
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

			await main.run();

			expect(writer.sitemaps).toMatchSnapshot();
			expect(writer.sitemaps.length).toBe(result);
		}));
});
