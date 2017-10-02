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
			`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://foo.bar</loc><lastmod>${date.toISOString()}</lastmod><priority>0.5</priority><changefreq>never</changefreq></url></urlset>`,
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
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://foo.bar/1</loc></url><url><loc>http://foo.bar/2</loc></url></urlset>',
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://foo.bar/3</loc></url><url><loc>http://foo.bar/4</loc></url></urlset>',
		];
		expect(xml).toEqual(res);
	});

	it('sould format correctly with video data added', () => {
		const xml = formatter.format([
			{
				loc: 'http://www.example.com/videos/some_video_landing_page.html',
				video: [
					{
						thumbnail_loc: 'http://www.example.com/thumbs/123.jpg',
						title: 'Grilling steaks for summer',
						description:
							'Alkis shows you how to get perfectly done steaks every time',
						content_loc: 'http://www.example.com/video123.mp4',
						player_loc: 'http://www.example.com/videoplayer.mp4?video=123',
						duration: '600',
						expiration_date: new Date('2009-11-05T19:20:30+08:00'),
						rating: 4.2,
						view_count: 12345,
						publication_date: new Date('2007-11-05T19:20:30+08:00'),
						family_friendly: true,
						requires_subscription: true,
						live: false,
					},
				],
			},
		]);
		const res = [
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://www.example.com/videos/some_video_landing_page.html</loc><video:video><video:thumbnail_loc>http://www.example.com/thumbs/123.jpg</video:thumbnail_loc><video:title>Grilling steaks for summer</video:title><video:description>Alkis shows you how to get perfectly done steaks every time</video:description><video:content_loc>http://www.example.com/video123.mp4</video:content_loc><video:player_loc>http://www.example.com/videoplayer.mp4?video=123</video:player_loc><video:duration>600</video:duration><video:expiration_date>2009-11-05T11:20:30.000Z</video:expiration_date><video:rating>4.2</video:rating><video:view_count>12345</video:view_count><video:publication_date>2007-11-05T11:20:30.000Z</video:publication_date><video:family_friendly>yes</video:family_friendly><video:requires_subscription>yes</video:requires_subscription><video:live>no</video:live></video:video></url></urlset>',
		];
		expect(xml).toEqual(res);
	});

	it('should format correctly with image data added', () => {
		const xml = formatter.format([
			{
				loc: 'http://example.com/sample.html',
				image: [
					{
						loc: 'http://example.com/image.jpg',
						caption: 'an image',
						geo_location: 'Earth, Milkyway',
						title: 'Example',
						license: 'MIT',
					},
					{ loc: 'http://example.com/photo.jpg' },
				],
			},
		]);
		const res = [
			'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"><url><loc>http://example.com/sample.html</loc><image:image><image:loc>http://example.com/image.jpg</image:loc><image:caption>an image</image:caption><image:geo_location>Earth, Milkyway</image:geo_location><image:title>Example</image:title><image:license>MIT</image:license></image:image><image:image><image:loc>http://example.com/photo.jpg</image:loc></image:image></url></urlset>',
		];
		expect(xml).toEqual(res);
	});
});
