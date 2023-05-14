export default async function (params, page, pageSize) {
  const query = this.generateElementsDbQuery(params, page, pageSize);

  console.log(query);

  const res = await this.pool.query(query.query, query.parameters);

  return res.rows.map((r) => r.id);
}
