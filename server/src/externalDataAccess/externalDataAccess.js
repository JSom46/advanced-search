import { getTags } from "./getTags.js";
import { getElements } from "./getElements.js";
import { parseURL } from "./parseURL.js";

export default class ExternalDataAccess {
  static getTags = getTags;
  static getElements = getElements;
  static parseURL = parseURL;
}
