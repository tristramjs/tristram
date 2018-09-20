/* @flow */
import fetchMock from 'fetch-mock';

import RelayConnectionFetcher from '../../src/fetching/RelayConnectionFetcher';

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

	it('should retry at least 3 times on error', async () => {
		const fetcher = new RelayConnectionFetcher({
			url: 'http://error.com/graphql',
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

	it('should stop retrying after 3 times on error and then throw', async () => {
		const fetcher = new RelayConnectionFetcher({
			url: 'http://error2.com/graphql',
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

		try {
			for await (const item of fetcher.getData()) {
				expect(item).toMatchSnapshot();
			}
		} catch (err) {
			expect(err).toEqual(new Error('Error fetching connection, tried 3 times.'));
		}
	});

	it('should stop immediately on major error and then throw', async () => {
		const fetcher = new RelayConnectionFetcher({
			url: 'http://error3.com/graphql',
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

		try {
			for await (const item of fetcher.getData()) {
				expect(item).toMatchSnapshot();
			}
		} catch (err) {
			expect(err).toEqual(new Error('server response error 404'));
		}
	});
});

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error.com/graphql' && body.variables.after == null;
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNextPage: true,
					},
					edges: [
						{
							node: {
								id: 'one',
								lastmod: '2009-11-05T19:20:30+08:00',
								priority: 0.5,
								changefreq: 'never',
							},
							cursor: 'two',
						},
					],
				},
			},
		},
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error.com/graphql' && body.variables.after === 'two';
	},
	{
		body: {
			data: null,
			errors: [ { message: "It's dead Jim." } ],
		},
		status: 429,
	},
	{
		repeat: 2,
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error.com/graphql' && body.variables.after === 'two';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNextPage: false,
					},
					edges: [
						{
							node: {
								id: 'two',
								lastmod: '2009-11-05T19:20:30+08:00',
								priority: 0.5,
								changefreq: 'never',
							},
							cursor: 'bla',
						},
					],
				},
			},
		},
	},
	{ overwriteRoutes: true }
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error2.com/graphql' && body.variables.after == null;
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNextPage: true,
					},
					edges: [
						{
							node: {
								id: 'one',
								lastmod: '2009-11-05T19:20:30+08:00',
								priority: 0.5,
								changefreq: 'never',
							},
							cursor: 'two',
						},
					],
				},
			},
		},
	},
	{ overwriteRoutes: true }
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error2.com/graphql' && body.variables.after === 'two';
	},
	{
		body: {
			data: null,
			errors: [ { message: "It's dead Jim." } ],
		},
		status: 429,
	},
	{
		repeat: 4,
		overwriteRoutes: true,
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://error3.com/graphql' && body.variables.after == null;
	},
	{
		body: {
			data: null,
			errors: [ { message: "It's dead Jim." } ],
		},
		status: 404,
	},
	{ overwriteRoutes: true }
);
