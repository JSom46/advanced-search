import { getElements } from "./getElements.js";
import { getTags } from "./getTags.js";
import { validateElementsQueryParams } from "./validateElementsQueryParams.js";
import { validateTagsQueryParams } from "./validateTagsQueryParams.js";

export default class Utils {
  static getElements = getElements;
  static getTags = getTags;
  static validateElementsQueryParams = validateElementsQueryParams;
  static validateTagsQueryParams = validateTagsQueryParams;
}
