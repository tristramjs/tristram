/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData } from '../types/sitemap';
import coroutine from '../util/coroutine';

// kill this, use xmlbuilder only in formatter? File writer needs to get reworked then

async function* appendToXmlGenerator(cb: (data: string) => Promise<*>): AsyncGenerator<void, void, RawSiteMapData[]> {
	let promises = [];

	const builder = xmlbuilder.begin(data => promises.push(cb(data)));
	builder
		.dec()
		.ele('urlset');

	try {
		let data;
		while (true) {
			await promises.pop();
			data = yield;
			// data is string, rework flow or kill this module
			builder.raw(data);
		}
	} finally {
		await Promise.all(promises);
		promises = [];
		builder.end();
		await promises.pop();
	}
}

const appendToXml: (cb: (data: string) => Promise<*>) => AsyncGenerator<void, void, RawSiteMapData[]> = coroutine(
	appendToXmlGenerator
);

export default appendToXml;
