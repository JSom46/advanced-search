export const isValidTagGroup = (tagGroup) =>
  /^(?:[a-z]|123|all)$/.test(tagGroup);

export const sqlRegexFromTagGroup = (tagGroup) => {
  if (/^(?:[a-z])$/.test(tagGroup)) return `^${tagGroup}.*$`;
  if (/^(?:123)$/) return "^[^a-zA-Z].*$";
  throw "Not a valid tag group";
};
