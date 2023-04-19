import { pool } from "./pgCon.js";
import { generateDbQuery } from "./generateDbQuery.js";

export const getElementsFromDb = async (params) => {
    const query = generateDbQuery(params);

    console.log(query);

    const res = await pool.query(query.query, query.parameters);

    return res.rows.map(r => r.id);
};