import { pool } from "./pgCon.js";
import { generateElementsDbQuery } from "./generateElementsDbQuery.js";

export const getElementsFromDb = async (params) => {
    const query = generateElementsDbQuery(params);

    console.log(query);

    const res = await pool.query(query.query, query.parameters);

    return res.rows.map(r => r.id);
};