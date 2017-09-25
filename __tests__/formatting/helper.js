/* @flow */
import { siteMapDataMapper, createSitemap } from '../../src/formatting/helper';

describe('Helper Formatting Module', () => {
	const date = new Date();
	test('siteMapDataMapper', () => {
		const loc = 'http://foo.bar';
		const data = { loc, lastmod: date };
		const expectedOutput = { loc, lastmod: date.toISOString() };
		expect(siteMapDataMapper(data)).toEqual(expectedOutput);
	});
	test('createSitemap', () => {
		const xml = createSitemap([
			{
				loc: 'http://foo.bar',
				lastmod: date.toISOString(),
				priority: 0.5,
				changefreq: 'never',
			},
		]); //mising data
		expect(xml).toEqual(
			`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://foo.bar</loc><lastmod>${date.toISOString()}</lastmod><priority>0.5</priority><changefreq>never</changefreq></url></urlset>`,
		);
	});
});
