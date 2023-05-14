export default class Area {
  static language = 0;
  static character = 1;
  static tag = 2;
  static series = 3;
  static artist = 4;

  static isValidArea(area) {
    return (
      area === Area.language ||
      area === Area.character ||
      area === Area.tag ||
      area === Area.series ||
      area === Area.artist
    );
  }

  static stringToArea(text) {
    if (text === "language" || text == "languages") return Area.language;
    if (text === "character" || text == "characters") return Area.character;
    if (text === "tag" || text == "tags") return Area.tag;
    if (text === "series") return Area.series;
    if (text === "artist" || text == "artists") return Area.artist;
    return -1;
  }

  static areaToString(area, plural = false) {
    return plural
      ? this._areaToStringPlural[area]
      : this._areaToStringSingular[area];
  }

  static _areaToStringPlural = [
    "languages",
    "characters",
    "tags",
    "series",
    "artists",
  ];

  static _areaToStringSingular = [
    "language",
    "character",
    "tag",
    "series",
    "artist",
  ];
}
