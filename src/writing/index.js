/* @flow */

import FileWriter from './FileWriter';
import S3Writer from './S3Writer';
import InMemoryWriter from './InMemoryWriter';

export type Path = string;

export interface Writer {
	write(key: string, data: string): Promise<string>;
}

export { FileWriter, S3Writer, InMemoryWriter };
