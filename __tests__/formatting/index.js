/* @flow */
import PlainFormatter from '../../src/formatting/index';
import { NewsSiteMapFormatter } from '../../src/formatting/index';

const date = new Date('2009-11-05T19:20:30+08:00');
const options = {
	hostname: 'foo.bar',
	maxItemsPerSitemap: 2,
	path: 'sitemaps',
};

describe('Formatting Module', () => {
	const formatter = new PlainFormatter({ options });
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
		]);
		expect(xml).toMatchSnapshot();
	});

	it('should format correctly with more data than the maxItemsPerSitemap threshold', () => {
		const xml = formatter.format([
			{ loc: 'http://foo.bar/1' },
			{ loc: 'http://foo.bar/2' },
			{ loc: 'http://foo.bar/3' },
			{ loc: 'http://foo.bar/4' },
		]);
		expect(xml).toMatchSnapshot();
	});

	it('sould format correctly with video data added', () => {
		const xml = formatter.format([
			{
				loc: 'http://www.example.com/videos/some_video_landing_page.html',
				video: [
					{
						thumbnail_loc: 'http://www.example.com/thumbs/123.jpg',
						title: 'Grilling steaks for summer',
						description: 'Alkis shows you how to get perfectly done steaks every time',
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
		expect(xml).toMatchSnapshot();
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
		expect(xml).toMatchSnapshot();
	});
});

describe('NewsSiteMapFormatter', () => {
	const formatter = new NewsSiteMapFormatter({ options: { ...options, maxItemsPerSitemap: 2000 } });
	it('should initalize', () => {
		expect(formatter).toBeInstanceOf(NewsSiteMapFormatter);
	});
	it('should set maxItemsPerSitemap down to 1000, if maxItemsPerSitemap is greater', () => {
		expect(formatter.options.maxItemsPerSitemap).toBe(1000);
	});
	it('should format correctly', () => {
		const xml = formatter.format([
			{
				loc: 'http://www.example.org/business/article55.html',
				news: {
					publication: {
						name: 'The Example Times',
						language: 'en',
					},
					genres: 'PressRelease, Blog', // or array!
					publication_date: date,
					title: 'Companies A, B in Merger Talks',
					keywords: 'business, merger, acquisition, A, B', //or array!
					stock_tickers: 'NASDAQ:A, NASDAQ:B', // or array!
				},
			},
		]);
		expect(xml).toMatchSnapshot();
	});
	it('should format correctly with more data than the maxItemsPerSitemap threshold', () => {
		const formatter = new NewsSiteMapFormatter({ options });
		const xml = formatter.format([
			{
				loc: 'http://foo.bar/1',
				news: {
					publication: {
						name: 'The Example Times',
						language: 'en',
					},
					title: 'Test',
				},
			},
			{
				loc: 'http://foo.bar/2',
				news: {
					publication: {
						name: 'The Example Times',
						language: 'en',
					},
					title: 'Test',
				},
			},
			{
				loc: 'http://foo.bar/3',
				news: {
					publication: {
						name: 'The Example Times',
						language: 'en',
					},
					title: 'Test',
				},
			},
			{
				loc: 'http://foo.bar/4',
				news: {
					publication: {
						name: 'The Example Times',
						language: 'en',
					},
					title: 'Test',
				},
			},
		]);
		expect(xml).toMatchSnapshot();
	});
});
