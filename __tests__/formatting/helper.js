/* @flow */
import {
	siteMapDataMapper,
	createSitemap,
	createIndexSitemap,
	createXML,
	prefixKeysInObject,
	boolToText,
	newsSiteMapDataMapper,
} from '../../src/formatting/helper';

xdescribe('Helper Formatting Module', () => {
	const date = new Date('2009-11-05T19:20:30+08:00');
	test('siteMapDataMapper', () => {
		const loc = 'http://foo.bar';
		const image = [ { loc }, { loc } ];
		const video = [
			{
				thumbnail_loc: loc,
				title: 'title',
				description: 'description',
				expiration_date: date,
				publication_date: date,
				family_friendly: true,
				requires_subscription: false,
				live: false,
				restriction: {
					relationship: 'allow',
					countrys: [ 'IE', 'GB' ],
				},
				gallery_loc: {
					title: 'test',
					url: 'http://foo.bar',
				},
				price: [
					{
						amount: 1.99,
						currency: 'EUR',
						type: 'rent',
						resolution: 'HD',
					},
				],
				uploader: { name: 'Bernd', info: 'http://bpaul.us' },
				platform: {
					relationship: 'allow',
					countrys: [ 'web', 'tv' ],
				},
				player_loc: { loc: 'http://foo.bar', autoplay: 'autoplay=1' },
			},
		];
		const data = {
			loc, image, video, lastmod: date,
		};
		const expectedOutput = {
			loc,
			lastmod: date.toISOString(),
			'image:image': [ { 'image:loc': loc }, { 'image:loc': loc } ],
			'video:video': [
				{
					'video:thumbnail_loc': loc,
					'video:title': 'title',
					'video:description': 'description',
					'video:expiration_date': date.toISOString(),
					'video:publication_date': date.toISOString(),
					'video:family_friendly': 'yes',
					'video:requires_subscription': 'no',
					'video:live': 'no',
					'video:restriction': { '@relationship': 'allow', '#text': 'IE GB' },
					'video:gallery_loc': { '@title': 'test', '#text': 'http://foo.bar' },
					'video:price': [ {
						'#text': 1.99, '@currency': 'EUR', '@type': 'rent', '@resolution': 'HD',
					} ],
					'video:uploader': { '#text': 'Bernd', '@info': 'http://bpaul.us' },
					'video:platform': { '@relationship': 'allow', '#text': 'web tv' },
					'video:player_loc': { '#text': 'http://foo.bar', '@autoplay': 'autoplay=1' },
				},
			],
		};
		expect(siteMapDataMapper(data)).toEqual(expectedOutput);
	});
	test('newsSiteMapDataMapper', () => {
		const loc = 'http://foo.bar';
		const publication = {
			name: 'test',
			language: 'en',
		};
		const genres = [ 'Blog', 'Opinion' ];
		const publication_date = date;
		const keywords = [ 'this', 'is', 'a', 'test' ];
		const stock_tickers = [ 'NASDAQ:A', 'NASDAQ:B' ];
		const data = {
			loc,
			news: {
				publication,
				genres,
				title: 'test',
				publication_date,
				keywords,
				stock_tickers,
			},
		};

		const expectedOutput = {
			loc,
			'news:news': {
				'news:publication': {
					'news:name': 'test',
					'news:language': 'en',
				},
				'news:genres': 'Blog, Opinion',
				'news:title': 'test',
				'news:publication_date': date.toISOString(),
				'news:keywords': 'this, is, a, test',
				'news:stock_tickers': 'NASDAQ:A, NASDAQ:B',
			},
		};

		expect(newsSiteMapDataMapper(data)).toEqual(expectedOutput);
	});
	test('createSitemap', () => {
		const xml = createSitemap([
			{
				loc: 'http://foo.bar',
				lastmod: date.toISOString(),
				priority: 0.5,
				changefreq: 'never',
			},
		]);
		expect(xml).toMatchSnapshot();
	});
	test('createIndexSitemap', () => {
		const xml = createIndexSitemap(1, 'foo.bar', 'sitemaps');
		expect(xml).toMatchSnapshot();
	});
	test('createXML', () => {
		expect(createXML({ test: 123 })).toMatchSnapshot();
	});
	test('prefixKeysInObject', () => {
		const obj = { test: 'test' };
		const res = { 'test:test': 'test' };
		expect(prefixKeysInObject(obj, 'test')).toEqual(res);
	});
	test('boolToText', () => {
		expect(boolToText(true)).toBe('yes');
	});
});
