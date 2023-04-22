import { pool } from "./pgCon.js";
import { generateElementsDbQuery } from "./generateElementsDbQuery.js";

export const getElementsFromDb = async (params, page, pageSize) => {
    const query = generateElementsDbQuery(params, page, pageSize);

    console.log(query);

    const res = await pool.query(query.query, query.parameters);

    return res.rows.map(r => r.id);
};