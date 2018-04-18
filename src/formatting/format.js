// @flow

import type { RawSiteMapData, MappedSiteMapData } from '../types/sitemap';

export function prefixKeysInObject(obj: Object, prefix: string): Object {
	const rObj = Object.assign(
		// $FlowFixMe
		...Object.keys(obj).map(key => ({
			[`${prefix}:${key.toString()}`]: obj[key],
		}))
	);
	return rObj;
}

export function boolToText(bool: boolean): string {
	if (bool) {
		return 'yes';
	}
	return 'no';
}

export function mapPrice(price: Array<*>) {
	return price.map((item) => {
		const rvalue = { '#text': item.amount, '@currency': item.currency };
		if (item.type) {
			// $FlowFixMe
			rvalue['@type'] = item.type;
		}
		if (item.resolution) {
			// $FlowFixMe
			rvalue['@resolution'] = item.resolution;
		}
		return rvalue;
	});
}

export function mapImage(image: Object | Array<*>) {
	if (Array.isArray(image)) {
		return image.map(obj => prefixKeysInObject(obj, 'image'));
	}
	if (typeof image === 'object' && !Array.isArray(image)) {
		return prefixKeysInObject(image, 'image');
	}
	return null;
}

/* eslint-disable complexity, max-statements, no-undefined */
export function mapVideoData(obj: Object) {
	const updated = { ...obj };
	if (obj.expiration_date) {
		updated.expiration_date = obj.expiration_date.toISOString();
	}
	if (obj.publication_date) {
		updated.publication_date = obj.publication_date.toISOString();
	}
	if (obj.family_friendly !== null || obj.family_friendly !== undefined) {
		updated.family_friendly = boolToText(obj.family_friendly);
	}
	if (obj.requires_subscription !== null || obj.requires_subscription !== undefined) {
		updated.requires_subscription = boolToText(obj.requires_subscription);
	}
	if (obj.live !== null || obj.live !== undefined) {
		updated.live = boolToText(obj.live);
	}
	if (obj.restriction) {
		updated.restriction = {
			'@relationship': obj.restriction.relationship,
			'#text': obj.restriction.countrys.join(' '),
		};
	}
	if (obj.gallery_loc) {
		if (obj.gallery_loc.title) {
			updated.gallery_loc = {
				'#text': obj.gallery_loc.url,
				'@title': obj.gallery_loc.title,
			};
		} else {
			updated.gallery_loc = { '#text': obj.gallery_loc.url };
		}
	}
	if (obj.price) {
		updated.price = mapPrice(obj.price);
	}
	if (obj.uploader) {
		if (obj.uploader.info) {
			updated.uploader = {
				'#text': obj.uploader.name,
				'@info': obj.uploader.info,
			};
		} else {
			updated.uploader = { '#text': obj.uploader.name };
		}
	}
	if (obj.platform) {
		updated.platform = {
			'@relationship': obj.platform.relationship,
			'#text': obj.platform.countrys.join(' '),
		};
	}
	if (obj.player_loc) {
		if (obj.player_loc.autoplay) {
			updated.player_loc = {
				'#text': obj.player_loc.loc,
				'@autoplay': obj.player_loc.autoplay,
			};
		} else {
			updated.player_loc = { '#text': obj.player_loc.loc };
		}
	}
	return updated;
}
/* eslint-enable complexity, max-statements, no-undefined */

export function mapVideo(video: Object | Array<*>) {
	if (Array.isArray(video)) {
		const updated = video.map(obj => mapVideoData(obj));
		return updated.map(obj => prefixKeysInObject(obj, 'video'));
	}
	if (typeof video === 'object' && !Array.isArray(video)) {
		const updated = mapVideoData(video);
		return prefixKeysInObject(updated, 'video');
	}
	return null;
}


export function siteMapDataMapper(item: RawSiteMapData): MappedSiteMapData {
	const updated = { ...item };
	if (item.lastmod) {
		updated.lastmod = item.lastmod.toISOString();
	}
	if (item.image) {
		updated['image:image'] = mapImage(item.image);
		delete updated.image;
	}
	if (item.video) {
		updated['video:video'] = mapVideo(item.video);
		delete updated.video;
	}
	// $FlowFixMe
	return updated;
}
