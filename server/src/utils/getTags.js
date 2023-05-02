import { getTagsFromDb } from "../postgresDataAccess/getTagsFromDB.js";

export const getTags = async (area, group = "a") => {
  const tags = await getTagsFromDb(area, group);
  return tags;
};
