import Area from "../utils/area.js";

/* structure of query object
[
	{
		vals: [
			{
				area: number,
				val: string,
				negate: bool
			}
		]
	}
]
*/

export default function (query, page, pageSize) {
  const vals = [];
  const whereClause = [];
  let i = 1;

  query.forEach((s) => {
    const subQuery = [];

    s.vals.forEach((v) => {
      switch (v.area) {
        case Area.language: {
          subQuery.push(
            "(" +
              (v.negate
                ? `e.language IS NULL OR e.language != (SELECT b.id FROM languages b WHERE b.name = $${i++})`
                : `e.language = (SELECT b.id FROM languages b WHERE b.name = $${i++})`) +
              ")"
          );
          break;
        }
        case Area.character: {
          subQuery.push(
            "(" +
              (v.negate
                ? `c.character IS NULL OR c.character != (SELECT b.id FROM characters b WHERE b.name = $${i++})`
                : `c.character = (SELECT b.id FROM characters b WHERE b.name = $${i++})`) +
              ")"
          );
          break;
        }
        case Area.tag: {
          subQuery.push(
            "(" +
              (v.negate
                ? `t.tag IS NULL OR t.tag != (SELECT b.id FROM tags b WHERE b.name = $${i++})`
                : `t.tag = (SELECT b.id FROM tags b WHERE b.name = $${i++})`) +
              ")"
          );
          break;
        }
        case Area.series: {
          subQuery.push(
            "(" +
              (v.negate
                ? `s.series IS NULL OR s.series != (SELECT b.id FROM series b WHERE b.name = $${i++})`
                : `s.series = (SELECT b.id FROM series b WHERE b.name = $${i++})`) +
              ")"
          );
          break;
        }
        case Area.artist: {
          subQuery.push(
            "(" +
              (v.negate
                ? `a.artist IS NULL OR a.artist != (SELECT b.id FROM artists b WHERE b.name = $${i++})`
                : `a.artist = (SELECT b.id FROM artists b WHERE b.name = $${i++})`) +
              ")"
          );
          break;
        }
        default: {
          throw `Invalid area: ${v.area}.`;
        }
      }

      vals.push(v.val);
    });

    if (subQuery.length > 0) {
      whereClause.push(`(${subQuery.join(" AND ")})`);
    }
  });

  const uniqueAreas = new Set();

  query.forEach((s) => {
    s.vals.forEach((v) => {
      uniqueAreas.add(v.area);
    });
  });

  const queryString =
    `SELECT e.id FROM elements e${
      uniqueAreas.has(Area.artist)
        ? " LEFT JOIN element_artist a ON e.id = a.element"
        : ""
    }${
      uniqueAreas.has(Area.character)
        ? " LEFT JOIN element_character c ON e.id = c.element"
        : ""
    }${
      uniqueAreas.has(Area.series)
        ? " LEFT JOIN element_series s ON e.id = s.element"
        : ""
    }${
      uniqueAreas.has(Area.tag)
        ? " LEFT JOIN element_tag t ON e.id = t.element"
        : ""
    }` +
    (whereClause.length > 0 ? ` WHERE ${whereClause.join(" OR ")}` : "") +
    (!isNaN(page) && !isNaN(pageSize) && page > 0 && pageSize > 0
      ? ` OFFSET ${(page - 1) * pageSize} LIMIT ${pageSize};`
      : ";");

  return { query: queryString, parameters: vals };
}
