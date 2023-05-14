import TagGroup from "../utils/tagGroup.js";

export default function (area, group) {
  return `SELECT name FROM ${area} ${
    group === "all"
      ? ""
      : `WHERE name ~ '${TagGroup.sqlRegexFromTagGroup(group)}'`
  };`;
}
