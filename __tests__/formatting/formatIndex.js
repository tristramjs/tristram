// @flow
import createIndexSitemap from '../../src/formatting/formatIndex';

describe('formatIndex', () => {
	const number = 10;
	const hostname = 'computer.me';
	const path = '/here/sitemap';
	test('formatIndexSitemap', () => {
		expect(createIndexSitemap(number, hostname, path)).toMatchSnapshot();
	});
});
