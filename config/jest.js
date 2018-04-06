/* @flow */
require('@babel/polyfill');

import fetchMock from 'fetch-mock';

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
						hasNext: true,
					},
					edges: [ { node: { id: 'bla' }, cursor: 'test' } ],
				},
			},
		},
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after === 'test';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNext: false,
					},
					edges: [ { node: { id: 'blerb' }, cursor: 'bar' } ],
				},
			},
		},
	}
);
