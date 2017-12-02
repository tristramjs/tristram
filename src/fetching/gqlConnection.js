/* @flow */
import type { Fetcher } from './index';
import type { RawSiteMapData } from '../main';
import GqlFetcher from './gql';

type Props = {
	url: string,
	t: any => RawSiteMapData,
	p: <T>(x: Object) => { edges: { node: T }[], pageInfo: { hasNext: boolean } },
	query: string,
};

export default class GqlConnectionFetcher implements Fetcher {
	gqlFetcher: typeof GqlFetcher;
	url: string;
	query: string;
	variables: {
		first: number,
		after?: string,
	};
	t: any => RawSiteMapData;
	p: any => $FlowFixMe;

	constructor({ url, p, t, query }: Props) {
		this.url = url;
		this.p = p;
		this.t = t;
		this.query = query;
		this.variables = {
			first: 10,
		};
	}

	async getData(): Promise<RawSiteMapData[]> {
		const { p, url, query } = this;
		let hasNext = true;
		let queue = [];

		while (hasNext) {
			const gqlFetcher = new GqlFetcher({ t: p, url, query, variables: this.variables });

			try {
				const data: $FlowFixMe = await gqlFetcher.getData();
				queue.push(...data.edges.map(edge => this.t(edge.node)));
				hasNext = data.pageInfo.hasNext;
				this.variables = {
					first: 10,
					after: data.edges[data.edges.length - 1].cursor,
				};
			} catch (e) {
				console.log(e);
				break;
			}
		}

		return queue;
	}
}
