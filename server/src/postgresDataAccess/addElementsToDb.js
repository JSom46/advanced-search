import { pool } from "./pgCon.js";

export const addElementsToDb = async (elementsIds) => {
  await pool.query("CALL add_elements($1)", [elementsIds]);
};
