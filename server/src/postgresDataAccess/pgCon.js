import pg from 'pg';
const { Pool } = pg;

export const pool = new pg.Pool({
    user: process.env.PG_USER,
    database: process.env.DB_NAME,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    host: process.env.PG_HOST
});