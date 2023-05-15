export default async function (area) {
  const recentUpdatesCount = await this.pool.query(
    `SELECT COUNT(1) count FROM updates WHERE update_date >= CURRENT_DATE - INTERVAL '1 day' AND updated_table = '${area}';`
  );

  return recentUpdatesCount.rows[0].count == 0;
}
