import { pool } from "./pgCon.js";
import { areaToString } from "../utils/area.js";

export const getTagsFromDb = async (area, group = 'a') => {
    const tags = await pool.query(`SELECT name FROM ${areaToString(area, true)} WHERE name LIKE '${group}%'`);
    return tags;
};