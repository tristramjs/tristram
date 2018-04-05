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
	}, // details read: https://developers.google.com/webmasters/videosearch/sitemaps
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
