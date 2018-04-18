/* @flow */
import xmlbuilder from 'xmlbuilder';

import coroutine from '../util/coroutine';

/*
	We could use strings instead of the xmlbuilder here. The plusside is loosing a hard
	dependencie (xmlbuilder) but it might not be the safest way to just use pure strings
	for the outer parts of the xml document.
 */

async function* appendToXmlGenerator(cb: (data: string) => Promise<*>): AsyncGenerator<void, void, string> {
	let promises = [];

	const builder = xmlbuilder.begin(data => promises.push(cb(data)));
	builder
		.dec()
		.ele('urlset')
		// only if it is normal sitemap! All three aren't always needed..
		.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
		.att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
		.att('xmlns:video', 'http://www.google.com/schemas/sitemap-video/1.1');

	try {
		let data;
		while (true) {
			await promises.pop();
			data = yield;

			builder.raw(data);
		}
	} finally {
		await Promise.all(promises);
		promises = [];
		builder.end();
		await promises.pop();
	}
}

const appendToXml: (cb: (data: string) => Promise<*>) => AsyncGenerator<void, void, string> = coroutine(
	appendToXmlGenerator
);

export default appendToXml;
