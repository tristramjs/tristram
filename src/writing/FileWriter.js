/* @flow */
import { appendFile, writeFile } from '../util/fs';

import type { Writer, Path } from './index';

type Props = {
	path: Path,
};

export default class FileWriter implements Writer {
	path: Path;
	fileName: string;

	constructor({ path }: Props) {
		this.path = path;
	}

	async write(key: string, data: string) {
		const path = this.path + key;
		await writeFile(path, data);
		return path;
	}
}
