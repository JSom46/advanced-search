import PostgresDataAccess from "../postgresDataAccess/postgresDataAccess.js";

export const getTags = async (area, group = "a") => {
  const tags = await PostgresDataAccess.getTagsFromDb(area, group);
  return tags;
};
