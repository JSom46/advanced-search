export default async function (languages) {
  // yes, query string is not sanitized i know
  const query = `INSERT INTO languages (id, name) VALUES 
            ${languages.reduce(
              (prev, cur, idx) =>
                (prev += `${idx == 0 ? "" : ", "}(${idx}, '${cur}')`),
              ""
            )} 
            ON CONFLICT DO NOTHING;`;
  await this.pool.query(query);
}
