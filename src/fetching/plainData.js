/* flow */

import type { Fetcher } from './index';

type Props = {
	data: RawSiteMapData,
};

export default class PlainDataFetcher implements Fetcher {
	data: RawSiteMapData;

	constructor(props: Props) {
		this.data = props.data;
	}

	async getData(): Promise<RawSiteMapData> {
		return await new Promise(resolve => resolve(this.data));
	}
}
