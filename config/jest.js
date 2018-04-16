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
					edges: [ { node: { id: 'one' }, cursor: 'two' } ],
				},
			},
		},
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after == 'two';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNext: true,
					},
					edges: [ { node: { id: 'two' }, cursor: 'three' } ],
				},
			},
		},
	}
);

fetchMock.post(
	(url, opts) => {
		const body = JSON.parse(opts.body);
		return url === 'http://test.com/graphql' && body.variables.after == 'three';
	},
	{
		data: {
			viewer: {
				allTestItems: {
					pageInfo: {
						hasNext: true,
					},
					edges: [ { node: { id: 'three' }, cursor: 'four' } ],
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
						hasNext: false,
					},
					edges: [ { node: { id: 'four' }, cursor: 'bar' } ],
				},
			},
		},
	}
);
