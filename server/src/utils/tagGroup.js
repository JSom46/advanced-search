export default class TagGroup {
  static isValidTagGroup(tagGroup) {
    return /^(?:[a-z]|123|all)$/.test(tagGroup);
  }

  static sqlRegexFromTagGroup(tagGroup) {
    if (/^(?:[a-z])$/.test(tagGroup)) return `^${tagGroup}.*$`;
    if (/^(?:123)$/) return "^[^a-zA-Z].*$";
    throw "Not a valid tag group";
  }
}
