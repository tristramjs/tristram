/* @flow */
import RelayConnectionFetcher from '../../src/fetching/RelayConnection';

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
		const fetcher = new RelayConnectionFetcher({
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

		for await (const item of fetcher.getData()) {
			expect(item).toMatchSnapshot();
		}
	});

	it('should fetch the whole connection in chunks', async () => {
		// const gqlConnectionFetcher = new RelayConnectionFetcher({
		// 	url: 'http://test.com/graphql',
		// 	query,
		// 	getConnection: conn => conn.data.viewer.allTestItems,
		// 	chunkSize: 1,
		// 	transformResult: id => id,
		// });
		//
		// const data = await gqlConnectionFetcher.getData();
		//
		// expect(data).toEqual([ { id: 'bla' }, { id: 'blerb' } ]);
	});
});
