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
				publication_date: new Date('1995-12-17T03:24:00'),
				title: 'something',
				keywords: [ 'unrelated', 'bla', 'bla' ],
				stock_tickers: 'nyt',
			},
		};
		expect(newsSiteMapDataMapper(item)).toMatchSnapshot();
	});
});
