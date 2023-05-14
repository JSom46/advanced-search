import Area from "../../utils/area.js";
import ExternalDataAccess from "../../externalDataAccess/externalDataAccess.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import PostgresDataAccess from "../postgresDataAccess.js";

const filePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "create_db.sql"
);

// Read the SQL code from the file
const sql = fs
  .readFileSync(filePath)
  .toString()
  .replace(/--.*$/gm, "") // delete comments
  .replace(/(\r\n|\n|\r)/gm, " ") // delete newlines
  .replace(/\s+/g, " "); // delete excessive spaces

try {
  await PostgresDataAccess.pool.query("BEGIN");
  await PostgresDataAccess.pool.query(sql);
  await PostgresDataAccess.pool.query("COMMIT");
} catch (err) {
  // something wwent wrong - rollback changes
  await PostgresDataAccess.pool.query("ROLLBACK");
  throw err;
}

console.log("database created.");

const langs = {
  32: "mongolian",
  40: "chinese",
  20: "portuguese",
  29: "turkish",
  27: "tagalog",
  8: "english",
  10: "esperanto",
  37: "persian",
  16: "hungarian",
  36: "arabic",
  23: "slovak",
  4: "czech",
  28: "vietnamese",
  11: "french",
  34: "ukrainian",
  41: "japanese",
  5: "danish",
  14: "italian",
  35: "hebrew",
  17: "dutch",
  19: "polish",
  0: "indonesian",
  21: "romanian",
  39: "korean",
  3: "cebuano",
  18: "norwegian",
  31: "bulgarian",
  26: "swedish",
  38: "thai",
  30: "greek",
  2: "catalan",
  9: "spanish",
  13: "icelandic",
  24: "serbian",
  22: "albanian",
  6: "german",
  1: "javanese",
  7: "estonian",
  12: "hindi",
  33: "russian",
  25: "finnish",
  15: "latin",
};

try {
  const tags = await ExternalDataAccess.getTags(Area.tag);
  await PostgresDataAccess.addTagsToDb(tags, Area.tag);
  console.log("tags added.");

  const artists = await ExternalDataAccess.getTags(Area.artist);
  await PostgresDataAccess.addTagsToDb(artists, Area.artist);
  console.log("artists added.");

  const characters = await ExternalDataAccess.getTags(Area.character);
  await PostgresDataAccess.addTagsToDb(characters, Area.character);
  console.log("characters added.");

  const series = await ExternalDataAccess.getTags(Area.series);
  await PostgresDataAccess.addTagsToDb(series, Area.series);
  console.log("series added.");

  const langArr = [];
  for (let i = 0; i < 100; i++) {
    if (langs[i] !== undefined) langArr.push(langs[i]);
  }
  await PostgresDataAccess.addLanguagesToDb(langArr);
  console.log("languages added.");
} catch (err) {
  console.error("Error occurred while adding data to DB:", err);
}
