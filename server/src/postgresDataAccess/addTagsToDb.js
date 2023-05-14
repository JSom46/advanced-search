export default async function (tags, area) {
  await this.pool.query("CALL add_tags($1, $2);", [area, tags]);
}
