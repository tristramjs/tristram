// @flow

import newsSiteMapDataMapper from '../../src/formatting/formatNews';

describe('formatNews', () => {
	test('newsSiteMapDataMapper', () => {
		const item = {
			loc: 'br.de/something',
	    news: {
				publication: {
					name: 'Bayerischer Rundfunk',
					language: 'de_de',
				},
				genres: 'Blog',
				publication_date: '1995-12-17T02:24:00.000Z',
				title: 'something',
				keywords: [ 'unrelated', 'bla', 'bla' ],
				stock_tickers: 'nyt',
			},
		};
		expect(newsSiteMapDataMapper(item)).toMatchSnapshot();
	});
});
