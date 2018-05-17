/* @flow */

export type Path = string;

export interface Writer {
	write(key: string, data: string): Promise<string>;
}
