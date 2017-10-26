import httpMocks from 'node-mocks-http';
import tristramMiddleware from '../../src/pipeline/expressMiddleware';

import Main from '../../src/main';
import PlainDataFetcher from '../../src/fetching/plainData';
import PlainFormatter from '../../src/formatting';

describe('expressMiddleware', () => {
	const data = [ { loc: 'http://url1.bar' }, { loc: 'http://url2.bar' }, { loc: 'http://url3.bar' } ];
	const fetcher = new PlainDataFetcher({ data });
	const formatter = new PlainFormatter({
		options: {
			hostname: 'localhost',
			cacheTime: 500,
			maxItemsPerSitemap: 2,
			path: 'sitemaps',
		},
	});
	const main = new Main({ fetchers: [ fetcher ], formatter, options: { hostname: '', cacheTime: 0 } });
	const middleware = tristramMiddleware(main);
	test('call next() if method is not GET', () => {
		const req = httpMocks.createRequest({ method: 'POST' });
		const res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next).then(() => expect(next).toHaveBeenCalled());
	});
	test('call next() if requested sitemap is not availabel', () => {
		const req = httpMocks.createRequest({ method: 'GET', url: 'path/to/sitemap-3.xml' });
		const res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next).then(() => expect(next).toHaveBeenCalled());
	});
	test('call next() if request is not for sitemap or index sitemap', () => {
		const req = httpMocks.createRequest({ method: 'GET', url: 'path/to/something-1.xml' });
		const res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next).then(() => expect(next).toHaveBeenCalled());
	});
	test('return indexSitemap if valid indexSitemap request', async () => {
		const req = httpMocks.createRequest({ method: 'GET', url: 'path/to/index.xml' });
		let res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next);
		expect(res._getData()).toMatchSnapshot();
	});
	test('return sitemap if valid sitemap request', () => {
		const req = httpMocks.createRequest({ method: 'GET', url: 'path/to/sitemap-1.xml' });
		let res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next);
		expect(res._getData()).toMatchSnapshot();
	});
	test('call next() if indexsitemap is requested but not availabel', () => {
		const formatter = new PlainFormatter({
			options: {
				hostname: 'localhost',
				cacheTime: 500,
				maxItemsPerSitemap: 10,
				path: 'sitemaps',
			},
		});
		const main = new Main({ fetchers: [ fetcher ], formatter, options: { hostname: '', cacheTime: 0 } });
		const middleware = tristramMiddleware(main);
		const req = httpMocks.createRequest({ method: 'GET', url: 'path/to/index.xml' });
		let res = httpMocks.createResponse();
		const next = jest.fn();
		middleware(req, res, next).then(() => expect(next).toHaveBeenCalled());
	});
});
