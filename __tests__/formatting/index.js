/* @flow */
import PlainFormatter from '../../src/formatting/index';

describe('Formatting Module', () => {
	const formatter = new PlainFormatter();
	const date = new Date();
	it('should initalize', () => {
		expect(formatter).toBeInstanceOf(PlainFormatter);
	});

	it('should format correctly', () => {
		const xml = formatter.format([
			{
				loc: 'http://foo.bar',
				lastmod: date,
				priority: 0.5,
				changefreq: 'never',
			},
		]); //mising data
		expect(xml).toEqual([
			`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://foo.bar</loc><lastmod>${date.toISOString()}</lastmod><priority>0.5</priority><changefreq>never</changefreq></url></urlset>`,
		]);
	});
});
