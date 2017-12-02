/* @flow */
import GqlConnectionFetcher from '../../src/fetching/gqlConnection';
import fetchMock from 'fetch-mock';

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

describe('fetching.gqlConnection', () => {
	it('should fetch the whole connection in chunks', async () => {
		const gqlConnectionFetcher = new GqlConnectionFetcher({
			url: 'http://test.com/graphql',
			p: x => x.data.viewer.allTestItems,
			t: x => x,
			query,
		});

		const data = await gqlConnectionFetcher.getData();

		expect(data).toEqual([ { id: 'bla' }, { id: 'blerb' } ]);
	});
});
