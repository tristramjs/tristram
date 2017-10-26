#Usage of Tristram expressMiddleware
```js
import httpMocks from 'node-mocks-http';
import express from 'express';

import Main from '../main';
import PlainDataFetcher from '../fetching/plainData';
import PlainFormatter from '../formatting';
import tristramMiddleware from './expressMiddleware';

const app = express();

const data = [
	{ loc: 'http://url1.bar' },
	{ loc: 'http://url2.bar' },
	{ loc: 'http://url3.bar' },
	{ loc: 'http://url4.bar' },
	{ loc: 'http://url5.bar' },
];
const fetcher = new PlainDataFetcher({ data });
const formatter = new PlainFormatter({
	options: {
		hostname: 'localhost',
		cacheTime: 500,
		maxItemsPerSitemap: 2,
		path: 'sitemaps',
	},
});

const main = new Main({ fetchers: [ fetcher ], formatter, options: { hostname: '', cacheTime: 10000 } });

app.use('/sitemaps', tristramMiddleware(main));
app.get('/*', (req, res) => res.send('falthrough -> handle errors global'));
app.listen(9999, () => {
	console.log('listen on 9999');
});
```
