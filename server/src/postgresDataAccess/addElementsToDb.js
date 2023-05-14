export default async function (elementsIds) {
  await this.pool.query("CALL add_elements($1)", [elementsIds]);
}
