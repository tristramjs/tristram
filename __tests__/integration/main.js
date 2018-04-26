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
			transformResult: ({ id }) => ({ loc: id }),
		});

		const main = new Main({
			fetchers: [ syncFetcher/*, chunkFetcher */ ],
			formatter: new PlainFormatter(),
			writer: new FileWriter({ path, fileName: 'sitemap' }),
			options,
		});

		await main.run();

		const files = await readdir(path);
		for (const file of files) {
			expect(await readfile(`${path}/${file}`, 'utf8')).toMatchSnapshot();
		}

		expect(files.length).toBe(3);
	});

	afterAll(cleanup(path));
});
