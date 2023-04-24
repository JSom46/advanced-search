import { sqlRegexFromTagGroup } from "../utils/tagGroup.js";

export const generateTagsDbQuery = (area, group) => {
    return `SELECT name FROM ${area} ${ group === "all" ? "" : `WHERE name ~ '${sqlRegexFromTagGroup(group)}'`};`;
};