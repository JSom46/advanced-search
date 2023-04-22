import { isValidArea, stringToArea } from "../utils/area.js";
import { isValidTagGroup } from "./tagGroup.js";

export const validateTagsQueryParams = (area, group, page, pageSize) => {
    const endingWithS = /^[a-z0-9]+s$/;
    return isValidArea(stringToArea(area)) && endingWithS.test(area) && isValidTagGroup(group);
}