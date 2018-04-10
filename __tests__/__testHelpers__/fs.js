/* @flow */
import { exists, mkdir, readdir, unlink, rmdir } from '../../src/util/fs';

export function setup(path: string) {
	return async function _setup() {
		const folder = await exists(path);
		if (!folder) {
			await mkdir(path);
		}
	};
}
export function cleanup(path: string) {
	return async function _cleanup() {
		const folder = await exists(path);
		if (folder) {
			const files = await readdir(path);

			for (const file of files) {
				await unlink(`${path}${file}`);
			}

			await rmdir(path);
		}
	};
}
