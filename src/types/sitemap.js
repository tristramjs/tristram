/* @flow */

export type imageData = {
	loc: string,
	caption?: string,
	geo_location?: string,
	title?: string,
	license?: string,
};

export type videoData = {
	thumbnail_loc: string,
	title: string,
	description: string,
	content_loc?: string,
	player_loc?: { loc: string, autoplay?: string },
	duration?: string,
	expiration_date?: Date,
	rating?: number,
	view_count?: number,
	publication_date?: Date,
	family_friendly?: boolean,
	tag?: string[],
	category?: string,
	restriction?: {
		relationship: 'allow' | 'deny',
		countrys: string[],
	},
	// details read: https://developers.google.com/webmasters/videosearch/sitemaps
	gallery_loc?: {
		url: string,
		title?: string,
	},
	price?: { amount: number, currency: string, type?: 'rent' | 'own', resolution?: 'HD' | 'SD' }[],
	requires_subscription?: boolean,
	uploader?: { name: string, info?: string },
	platform?: { countrys: string[], relationship: 'allow' | 'deny' },
	live?: boolean,
};

export type RawSiteMapData = {
	loc: string,
	lastmod?: Date,
	priority?: number,
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
	image?: imageData[],
	video?: videoData[],
};

type newsGenres = 'Blog' | 'OpEd' | 'Opinion' | 'PressRelease' | 'Satire' | 'UserGenerated';

export type RawNewsSiteMapData = {
	loc: string,
	news: {
		publication: {
			name: string,
			language: string,
		},
		genres?: newsGenres | newsGenres[],
		publication_date: Date,
		title: string,
		keywords?: string | string[],
		stock_tickers?: string | string[],
	},
};

export type MappedSiteMapData = {
	// details read: https://developers.google.com/webmasters/videosearch/sitemaps
	url: {
		loc: string,
		lastmod?: string,
		priority?: number,
		changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
		'image:image'?: {
			'image:loc': string,
			'image:caption'?: string,
			'image:geo_location'?: string,
			'image:title'?: string,
			'image:license'?: string,
		}[],
		'video:video'?: {
			'video:thumbnail_loc': string,
			'video:title': string,
			'video:description': string,
			'video:content_loc'?: string,
			'video:player_loc'?: { '#text': string, '@autoplay'?: string },
			'video:duration'?: string,
			'video:expiration_date'?: string,
			'video:rating'?: number,
			'video:view_count'?: number,
			'video:publication_date'?: string,
			'video:family_friendly'?: string,
			'video:tag'?: string[],
			'video:category'?: string,
			'video:restriction'?: { '@relationship': 'allow' | 'deny', '#text': string },
			'video:gallery_loc'?: { '@title'?: string, '#text': string },
			'video:price'?: { '#text': number, '@currency': string, '@type'?: 'rent' | 'own', '@resolution'?: 'HD' | 'SD' }[],
			'video:requires_subscription'?: string,
			'video:uploader'?: { '#text': string, '@info'?: string },
			'video:platform'?: { '@relationship': 'allow' | 'deny', '#text': string },
			'video:live'?: string,
		}[],
	}
};

export type MappedNewsSiteMapData = {
	loc: string,
	'news:news': {
		'news:publication': {
			'news:name': string,
			'news:language': string,
		},
		'news:genres'?: string | string[],
		'news:publication_date': string,
		'news:title': string,
		'news:keywords'?: string | string[],
		'news:stock_tickers'?: string | string[],
	},
};
