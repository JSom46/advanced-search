import { generateTagsDbQuery } from "./generateTagsDbQuery.js";
import { pool } from "./pgCon.js";

export const getTagsFromDb = async (area, group = 'a') => {
    const query = generateTagsDbQuery(area, group);

    console.log(query);

    const tags = await pool.query(query);
    
    return tags.rows.map(r => r.name);
};