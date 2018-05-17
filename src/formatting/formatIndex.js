// @flow

export default function createIndexSitemap(numberSitemaps: number, hostname: string, path: string): Object {
	const indexItems = [];
	for (let iterator = numberSitemaps; iterator > 0; iterator = iterator - 1) {
		const sitemap = {
			loc: `https://${hostname}${path}/sitemap-${iterator - 1}.xml`,
		};
		indexItems.push(sitemap);
	}

	const xmlObj = {
		sitemapindex: {
			'@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
			sitemap: indexItems,
		},
	};

	return xmlObj;
}
