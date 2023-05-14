import Area from "../utils/area.js";
import TagGroup from "./tagGroup.js";

export const validateTagsQueryParams = (area, group, page, pageSize) => {
  const endingWithS = /^[a-z0-9]+s$/;
  return (
    Area.isValidArea(Area.stringToArea(area)) &&
    endingWithS.test(area) &&
    TagGroup.isValidTagGroup(group)
  );
};
