/* @flow */

/**
 * Returns a function that, when called,
 * returns a generator object that is immediately
 * ready for input via `next()`
 */
export default function coroutine(generatorFunction: *) {
	return function cb(...args: *) {
		const generatorObject = generatorFunction(...args);
		generatorObject.next();
		return generatorObject;
	};
}
