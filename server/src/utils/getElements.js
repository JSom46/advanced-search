import { Area } from "./area.js";
import { addTagElementsToDb } from "../postgresDataAccess/addTagElementsToDb.js";
import { addElementsToDb } from "../postgresDataAccess/addElementsToDb.js";
import { getOutdatedTags } from "../postgresDataAccess/getOutdatedTags.js";
import { getElementsFromDb } from "../postgresDataAccess/getElementsFromDb.js";
import { getElements } from "../externalDataAccess/getElements.js";
import { parseURL } from "../externalDataAccess/parseURL.js";

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
  const outdatedTags = await getOutdatedTags(params);

  console.log("Outdated tags");
  console.log(outdatedTags);

  if (outdatedTags.indexOutOfDate) {
    const hitomi = await getElements(parseURL("https://hitomi.la/"));
    console.log(hitomi);
    await addElementsToDb(hitomi);
  }

  const tagsElements = await Promise.all(
    outdatedTags.tags.map((t) =>
      getElements(
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
      addTagElementsToDb(t.name, t.area, tagsElements[idx])
    )
  );

  return await getElementsFromDb(params, page, pageSize);
};
