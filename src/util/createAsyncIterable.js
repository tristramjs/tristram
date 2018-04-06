/* @flow */

export default async function* createAsyncIterable(syncIterable: any) {
	for (const elem of syncIterable) {
		yield elem;
	}
}
