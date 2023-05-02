import { pool } from "./pgCon.js";

export const addTagElementsToDb = async (tag, area, ids) => {
  await pool.query("CALL set_tag_elements($1, $2, $3)", [area, tag, ids]);
};
