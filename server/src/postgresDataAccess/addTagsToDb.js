import { pool } from "./pgCon.js";

export const addTagsToDb = async (tags, area) => {
  await pool.query("CALL add_tags($1, $2);", [area, tags]);
};
