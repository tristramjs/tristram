/* @flow */
import xmlbuilder from 'xmlbuilder';

import coroutine from '../util/coroutine';

/*
	We could kill this function and write the few string output from xmlbuilder
	as strings in FileWriter. Plusside: We loose the dependencie to xmlbuilder in
	this part, but need to write static strings.

	--> Rewrite filewriter
 */

// kill this, use xmlbuilder only in formatter? File writer needs to get reworked then

async function* appendToXmlGenerator(cb: (data: string) => Promise<*>): AsyncGenerator<void, void, string> {
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
