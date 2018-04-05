/* @flow */
import fetchMock from 'fetch-mock';

import RelayConnectionFetcher from '../../src/fetching/relayConnection';

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after == null;
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNext: true,
					},
					edges: [ { node: { id: 'bla' }, cursor: 'test' } ],
				},
			},
		},
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after === 'test';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNext: false,
					},
					edges: [ { node: { id: 'blerb' }, cursor: 'bar' } ],
				},
			},
		},
	}
);

const query = /* GraphQL */ `query Test($first: Int!, $after: String) {
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
}`;

describe('fetching.gqlConnection', () => {
	it('should fetch the whole connection in chunks', async () => {
		const gqlConnectionFetcher = new RelayConnectionFetcher({
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
			transformResult: id => id,
		});

		const data = await gqlConnectionFetcher.getData();

		expect(data).toEqual([ { id: 'bla' }, { id: 'blerb' } ]);
	});

	it('should fetch the whole connection in chunks', async () => {
		const gqlConnectionFetcher = new RelayConnectionFetcher({
			url: 'http://test.com/graphql',
			query,
			getConnection: conn => conn.data.viewer.allTestItems,
			chunkSize: 1,
			transformResult: id => id,
		});

		const data = await gqlConnectionFetcher.getData();

		expect(data).toEqual([ { id: 'bla' }, { id: 'blerb' } ]);
	});
});
