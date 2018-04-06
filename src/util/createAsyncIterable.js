/* @flow */

export default async function* createAsyncIterable(syncIterable: any): AsyncGenerator<*, *, *> {
	for (const elem of syncIterable) {
		yield elem;
	}
}
