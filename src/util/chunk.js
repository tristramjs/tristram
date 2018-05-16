/* @flow */

function chunk<T>(arr: T[], chunkSize: number): T[][] {
	const chunks = [];
	let index = 0;
	const { length } = arr;

	while (index < length) {
		chunks.push(arr.slice(index, (index += chunkSize)));
	}

	return chunks;
}

export default chunk;
