import { Area } from "../utils/area.js";

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
export const generateElementsDbQuery = (query, page, pageSize) => {
  const vals = [];
  const whereClause = [];
  let i = 1;

  query.forEach((s) => {
    const subQuery = [];

    s.vals.forEach((v) => {
      switch (v.area) {
        case Area.language: {
          subQuery.push(
            `(SELECT b.id FROM elements b WHERE b.language ${
              v.negate ? "IS NULL OR b.language !=" : "="
            } (SELECT c.id FROM languages c WHERE c.name = $${i++}))`
          );
          break;
        }
        case Area.character: {
          subQuery.push(
            `(${
              v.negate ? "SELECT c.id FROM elements c EXCEPT " : ""
            }SELECT a.element id FROM element_character a WHERE a.character = (SELECT b.id FROM characters b WHERE b.name = $${i++}))`
          );
          break;
        }
        case Area.tag: {
          subQuery.push(
            `(${
              v.negate ? "SELECT c.id FROM elements c EXCEPT " : ""
            }SELECT a.element id FROM element_tag a WHERE a.tag = (SELECT b.id FROM tags b WHERE b.name = $${i++}))`
          );
          break;
        }
        case Area.series: {
          subQuery.push(
            `(${
              v.negate ? "SELECT c.id FROM elements c EXCEPT " : ""
            }SELECT a.element id FROM element_series a WHERE a.series = (SELECT b.id FROM series b WHERE b.name = $${i++}))`
          );
          break;
        }
        case Area.artist: {
          subQuery.push(
            `(${
              v.negate ? "SELECT c.id FROM elements c EXCEPT " : ""
            }SELECT a.element id FROM element_artist a WHERE a.artist = (SELECT b.id FROM artists b WHERE b.name = $${i++}))`
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
      whereClause.push(`(${subQuery.join(" INTERSECT ")})`);
    }
  });

  const queryString =
    "SELECT id FROM" +
    (whereClause.length > 0
      ? ` (${whereClause.join(" UNION ")}) id`
      : " elements") +
    (!isNaN(page) && !isNaN(pageSize) && page > 0 && pageSize > 0
      ? ` OFFSET ${(page - 1) * pageSize} LIMIT ${pageSize};`
      : ";");

  return { query: queryString, parameters: vals };
};
