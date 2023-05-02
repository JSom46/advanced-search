const AreaToStringSingular = [
  "language",
  "character",
  "tag",
  "series",
  "artist",
];

const AreaToStringPlural = [
  "languages",
  "characters",
  "tags",
  "series",
  "artists",
];

export const Area = {
  language: 0,
  character: 1,
  tag: 2,
  series: 3,
  artist: 4,
};

export const areaToString = (area, plural = false) =>
  plural ? AreaToStringPlural[area] : AreaToStringSingular[area];

export const stringToArea = (text) => {
  if (text === "language" || text == "languages") return Area.language;
  if (text === "character" || text == "characters") return Area.character;
  if (text === "tag" || text == "tags") return Area.tag;
  if (text === "series") return Area.series;
  if (text === "artist" || text == "artists") return Area.artist;
  return -1;
};

export const isValidArea = (area) =>
  area === Area.language ||
  area === Area.character ||
  area === Area.tag ||
  area === Area.series ||
  area === Area.artist;
