/* @flow */
import PlainFormatter from '../../src/formatting/index';

describe('Formatting Module', () => {
	const options = {
		hostname: 'foo.bar',
		maxItemsPerSitemap: 2,
		path: 'sitemaps',
	};
	const formatter = new PlainFormatter({ options });
	const date = new Date();
	it('should initalize', () => {
		expect(formatter).toBeInstanceOf(PlainFormatter);
	});

	it('should format correctly with less data than the maxItemsPerSitemap threshold', () => {
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

	it('should format correctly with more data than the maxItemsPerSitemap threshold', () => {
		const xml = formatter.format([
			{ loc: 'http://foo.bar/1' },
			{ loc: 'http://foo.bar/2' },
			{ loc: 'http://foo.bar/3' },
			{ loc: 'http://foo.bar/4' },
		]);
		const res = [
			'<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://foo.bar/sitemaps/sitemap-2.xml</loc></sitemap><sitemap><loc>https://foo.bar/sitemaps/sitemap-1.xml</loc></sitemap></sitemapindex>',
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://foo.bar/1</loc></url><url><loc>http://foo.bar/2</loc></url></urlset>',
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://foo.bar/3</loc></url><url><loc>http://foo.bar/4</loc></url></urlset>',
		];
		expect(xml).toEqual(res);
	});
});
