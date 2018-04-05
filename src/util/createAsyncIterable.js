/* @flow */

export default async function* createAsyncIterable(syncIterable) {
	for (const elem of syncIterable) {
		yield elem;
	}
}
