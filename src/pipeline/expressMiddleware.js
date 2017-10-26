/* @flow */

export default function tristramMiddleware(Tristram) {
	// cache Timing stuff
	let refetch: boolean = true;
	function timer(cacheTime) {
		setTimeout(() => {
			refetch = true;
			timer(cacheTime);
		}, cacheTime);
	}
	if (Tristram.options.cacheTime !== 0) {
		timer(Tristram.options.cacheTime);
	}

	let sitemap = [];

	return async function middleware(req, res, next) {
		// bail out, if not get request
		if (req.method !== 'GET') {
			next();
			return;
		}
		//cache timing stuff
		if (refetch === true) {
			sitemap = await Tristram.run();
			refetch = false;
		}
		// query handling
		const urlParts = req.url.split('/');
		let indexSitemap = false;
		let queryNr;
		if (urlParts[urlParts.length - 1] === 'index.xml') {
			indexSitemap = true;
		} else {
			const partsPart = urlParts[urlParts.length - 1].split('-');
			if (partsPart[0] === 'sitemap') {
				queryNr = Number.parseInt(partsPart[1]);
			}
		}
		/*
		actual handling

		-. query | Returned by Tristram
		1. indexsitemap | no index sitemap(array.length==0) -> next()
		2. indexsitemap | indexsitemap (array.lenght>0) -> send(array[0])
		3. sitemap-nr.xml | no sitemap for nr -> next()
		4. sitemap-nr.xml | corresponding sitemap -> send (array[nr])
		5. anyting else | anything -> next()
		*/
		const nrSitemaps = sitemap.length - 1;
		if (nrSitemaps === 0 && indexSitemap === true) {
			next();
			return;
		}
		if (indexSitemap === true) {
			res.header({ 'Content-Type': 'text/xml' }).send(sitemap[0]);
			return;
		}
		if (queryNr < 1 && queryNr > nrSitemaps) {
			next();
			return;
		}
		if (queryNr >= 1 && queryNr <= nrSitemaps) {
			res.header({ 'Content-Type': 'text/xml' }).send(sitemap[queryNr]);
			return;
		}
		next();
	};
}
