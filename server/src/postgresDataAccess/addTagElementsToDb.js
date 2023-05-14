export default async function (tag, area, ids) {
  await this.pool.query("CALL set_tag_elements($1, $2, $3)", [area, tag, ids]);
}
