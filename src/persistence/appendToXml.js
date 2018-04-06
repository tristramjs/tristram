/* @flow */
import xmlbuilder from 'xmlbuilder';

import type { RawSiteMapData } from '../types/sitemap';
import coroutine from '../util/coroutine';

function* appendToXmlGenerator(cb: (data: RawSiteMapData) => void) {
	const builder = xmlbuilder.begin(cb);
	builder.ele('foo');

	try {
		let data;
		while (true) {
			data = yield;
			builder.ele('node', data).up();
		}
	} finally {
		builder.end();
	}
}

const appendToXml = coroutine(appendToXmlGenerator);

export default appendToXml;
