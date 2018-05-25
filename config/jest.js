/* @flow */
require('@babel/polyfill');

/* eslint-disable import/no-extraneous-dependencies, import/first */
import fetchMock from 'fetch-mock';
/* eslint-enable import/no-extraneous-dependencies, import/first */

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after == null;
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
								lastmod: '2009-11-05T11:20:30.000Z',
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
		return url === 'http://test.com/graphql' && body.variables.after === 'two';
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
								id: 'two',
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
							cursor: 'three',
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
		return url === 'http://test.com/graphql' && body.variables.after === 'three';
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
								id: 'three',
								video: [
									{
										thumbnail_loc: 'http://www.example.com/thumbs/123.jpg',
										title: 'Grilling steaks for summer',
										description: 'Alkis shows you how to get perfectly done steaks every time',
										content_loc: 'http://www.example.com/video123.mp4',
										player_loc: { loc: 'http://www.example.com/videoplayer.mp4?video=123' },
										duration: '600',
										expiration_date: '2009-11-05T11:20:30.000Z',
										rating: 4.2,
										view_count: 12345,
										publication_date: '2007-11-05T11:20:30.000Z',
										family_friendly: true,
										tag: [ 'This', 'is', 'a', 'tag' ],
										restriction: { relationship: 'deny', countrys: [ 'GB', 'US' ] },
										gallery_loc: { url: 'http://bpaul.us' },
										price: [ { amount: 1, currency: 'EUR' }, { amount: 2, currency: 'USD' } ],
										uploader: { name: 'Mr Mister' },
										requires_subscription: true,
										live: false,
										platform: { countrys: [ 'tv' ], relationship: 'deny' },
									},
								],
							},
							cursor: 'four',
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
		return url === 'http://test.com/graphql' && body.variables.after === 'four';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNextPage: false,
					},
					edges: [ { node: { id: 'four' }, cursor: 'bar' } ],
				},
			},
		},
	}
);
