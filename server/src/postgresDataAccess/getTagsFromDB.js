export default async function (area, group = "a") {
  const query = this.generateTagsDbQuery(area, group);

  console.log(`tags query: ${query}`);

  const tags = await this.pool.query(query);

  return tags.rows.map((r) => r.name);
}
