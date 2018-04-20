/* @flow */

import { setup, cleanup } from '../__testHelpers__/fs';
import { readdir, readfile } from '../../src/util/fs';
import Main from '../../src/main';
import SyncFetcher from '../../src/fetching/SyncFetcher';
import RelayConnectionFetcher from '../../src/fetching/RelayConnection';
import FileWriter from '../../src/persistence/FileWriter';
import PlainFormatter from '../../src/formatting/Plain';

const path = `${process.cwd()}/MainIntegrationTest/`;

describe('Main module', () => {
	beforeAll(setup(path));

	it('should run without errors', async () => {
		const options = { hostname: 'http://foo.bar', maxItemsPerSitemap: 2 };

		const syncFetcher = new SyncFetcher({
			data: [ { loc: 'quz' }, { loc: 'qaz' }, { loc: 'qak' } ],
		});

		const chunkFetcher = new RelayConnectionFetcher({
			url: 'http://test.com/graphql',
			query: /* GraphQL */ `query Test($first: Int!, $after: String) {
				viewer {
					allTestItems(first: $first, after: $after) {
						pageInfo {
							hasNext
						}
						edges {
							cursor
							node {
								id
							}
						}
					}
				}
			}`,
			getConnection: conn => conn.data.viewer.allTestItems,
			transformResult: (data) => {
				const returnData = { ...data };
				returnData.loc = data.id;
				delete returnData.id;
				if (data.lastmod) {
					returnData.lastmod = new Date(data.lastmod);
				}
				if (data.video) {
					returnData.video = data.video.map((item) => {
						const returnItem = { ...item };
						if (item.expiration_date) {
							returnItem.expiration_date = new Date(item.expiration_date);
						}
						if (item.publication_date) {
							returnItem.publication_date = new Date(item.publication_date);
						}
						return returnItem;
					});
				}
				return returnData;
			},
		});

		const main = new Main({
			fetchers: [ syncFetcher, chunkFetcher ],
			formatter: new PlainFormatter(),
			writer: new FileWriter({ path, fileName: 'sitemap' }),
			options,
		});

		await main.run();

		const files = await readdir(path);
		for (const file of files) {
			expect(await readfile(`${path}/${file}`, 'utf8')).toMatchSnapshot();
		}

		expect(files.length).toBe(4);
	});

	afterAll(cleanup(path));
});
