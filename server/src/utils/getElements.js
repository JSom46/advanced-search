import Area from "./area.js";
import PostgresDataAccess from "../postgresDataAccess/postgresDataAccess.js";
import ExternalDataAccess from "../externalDataAccess/externalDataAccess.js";

/* structure of params object
[
	{
		vals: [
			{
				area: number,
				val: string
                negate: bool
			}
		]
	}
]
*/
export const getElements = async (params, page = 1, pageSize = 50) => {
  const outdatedTags = await PostgresDataAccess.getOutdatedTags(params);

  console.log("Outdated tags");
  console.log(outdatedTags);

  if (outdatedTags.indexOutOfDate) {
    const hitomi = await ExternalDataAccess.getElements(
      ExternalDataAccess.parseURL("https://hitomi.la/")
    );
    console.log(hitomi);
    await PostgresDataAccess.addElementsToDb(hitomi);
  }

  const tagsElements = await Promise.all(
    outdatedTags.tags.map((t) =>
      ExternalDataAccess.getElements(
        t.area == Area.language
          ? { tag: "index", language: t.name }
          : { tag: t.name, area: t.area, language: "all" }
      )
    )
  );

  console.log();
  console.log(tagsElements);

  await Promise.all(
    outdatedTags.tags.map((t, idx) =>
      PostgresDataAccess.addTagElementsToDb(t.name, t.area, tagsElements[idx])
    )
  );

  return await PostgresDataAccess.getElementsFromDb(params, page, pageSize);
};
