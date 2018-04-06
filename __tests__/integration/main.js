/* @flow */
import fetchMock from 'fetch-mock';

import { exists, mkdir, readdir, readfile, unlink, rmdir } from '../../src/util/fs';
import Main from '../../src/main';
import SyncFetcher from '../../src/fetching/SyncFetcher';
import RelayConnectionFetcher from '../../src/fetching/RelayConnection';
import FileWriter from '../../src/persistence/FileWriter';

const path = './tmp2';

async function setup() {
	const folder = await exists(path);
	if (!folder) {
		await mkdir(path);
	}
}

async function cleanup() {
	const folder = await exists(path);
	if (folder) {
		const files = await readdir(path);

		for (const file of files) {
			await unlink(`${path}/${file}`);
		}

		await rmdir(path);
	}
	fetchMock.reset();
}

describe('Main module', () => {
	beforeAll(setup);

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
			fetchers: [ syncFetcher, chunkFetcher ],
			writer: new FileWriter(),
			options,
		});

		await main.run();

		const files = await readdir(path);
		for (const file of files) {
			expect(await readfile(`${path}/${file}`, 'utf8')).toMatchSnapshot();
		}

		expect(files.length).toBe(3);
	});

	afterAll(cleanup);
});
