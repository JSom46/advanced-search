const AreaToStringSingular = ["language", "character", "tag", "series", "artist"];

const AreaToStringPlural = ["languages", "characters", "tags", "series", "artists"];

export const Area = {
	language: 0,
	character: 1,
	tag: 2,
	series: 3,
	artist: 4
};

export const areaToString = (area, plural = false) => plural ? AreaToStringPlural[area] : AreaToStringSingular[area];