/* @flow */

import type { Fetcher } from '../fetching/index';
import type { Formatter } from '../formatting/index';
import type { Writer } from '../writing/index';

import SitemapGenerator from './SitemapGenerator';

export { SitemapGenerator };

type Path = string;
type Content = string;

export interface FeedGenerator<Data> {
  fetchers: Fetcher<Data>[];
  formatter: Formatter<Data>;
  writer: Writer;
  run(): Promise<Path[] | Content[]>;
}
