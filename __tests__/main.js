/* @flow */
import Main from '../src/main';

describe('Main module', () => {
	it('should run without errors', async () => {
		const syncFetcher = { getData: () => Promise.resolve({ loc: 'foooo' }) };
		const formatter = {
			format: data => `<urlset><loc>${data[0].loc}</loc></urlset>`,
		};
		const main = new Main({
			fetchers: [syncFetcher],
			formatter,
			options: {
				hostname: 'http://foo.bar',
			},
		});

		const result = await main.run();

		expect(result).toBe('<urlset><loc>foooo</loc></urlset>');
	});
});
