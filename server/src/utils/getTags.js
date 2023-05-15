import PostgresDataAccess from "../postgresDataAccess/postgresDataAccess.js";
import ExternalDataAccess from "../externalDataAccess/externalDataAccess.js";
import Area from "./area.js";

export const getTags = async (area, group = "a") => {
  if (await PostgresDataAccess.IsAreaOutdated(area)) {
    const updatedTags = await ExternalDataAccess.getTags(
      Area.stringToArea(area)
    );
    await PostgresDataAccess.addTagsToDb(updatedTags, Area.stringToArea(area));
  }

  const tags = await PostgresDataAccess.getTagsFromDb(area, group);
  return tags;
};
