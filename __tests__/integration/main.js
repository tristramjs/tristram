/* @flow */
import Main from '../../src/main';
import HttpFetcher from '../../src/fetching/http';
import GraphQlFetcher from '../../src/fetching/graphQl';
import PlainFormatter from '../../src/formatting';

describe('Main / Integration Tests', () => {
	describe('Restful fetching', () => {
		it('should fetch and transform data into a valid sitemap', async () => {
			const url = 'https://api.github.com/users/octocat';
			const t = ({ url, created_at }) => ({ loc: url, lastmod: new Date(created_at) });
			const fetcher = new HttpFetcher({ url, t });
			const formatter = new PlainFormatter({
				options: {
					hostname: 'string',
					cacheTime: 500,
					maxItemsPerSitemap: 1000,
					path: 'string',
				},
			});
			const main = new Main({ fetchers: [ fetcher ], formatter, options: { hostname: '' } });

			const result = await main.run();

			expect(result).toMatchSnapshot();
		});
	});

	describe('GraphQL fetcher', () => {
		it('should fetch and transform data into a valid sitemap', async () => {
			const url = 'https://1jzxrj179.lp.gql.zone/graphql';
			const t = ({ data }) => data.posts.map(p => ({ loc: p.id }));
			const query = /* GraphQL */ `
				query Test {
					posts {
						id
					}
				}
			`;
			const fetcher = new GraphQlFetcher({ url, t, query });
			const formatter = new PlainFormatter({
				options: {
					hostname: 'string',
					cacheTime: 500,
					maxItemsPerSitemap: 1000,
					path: 'string',
				},
			});
			const main = new Main({ fetchers: [ fetcher ], formatter, options: { hostname: '' } });

			const result = await main.run();

			expect(result).toMatchSnapshot();
		});
	});
});
