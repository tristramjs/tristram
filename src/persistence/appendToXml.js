/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData } from '../types/sitemap';
import coroutine from '../util/coroutine';

async function* appendToXmlGenerator(cb: (data: string) => Promise<*>): AsyncGenerator<void, void, RawSiteMapData[]> {
	let promises = [];

	const builder = xmlbuilder.begin(data => promises.push(cb(data)));
	builder.ele('foo');

	try {
		let data;
		while (true) {
			await promises.pop();
			data = yield;
			// data is array! Do not map! @Bernd
			builder.ele('node', data).up();
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
