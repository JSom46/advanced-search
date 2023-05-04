import { Area } from "../../utils/area.js";
import { addLanguagesToDb } from "../addLanguagesToDb.js";
import { addTagsToDb } from "../addTagsToDb.js";
import { getTags } from "../../externalDataAccess/getTags.js";
import path from "path";
import fs from "fs";
import pg from "pg";
import { fileURLToPath } from "url";

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

// Create a new PostgreSQL client
const client = new pg.Client({
  user: process.env.PG_USER,
  database: process.env.DB_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  host: process.env.PG_HOST,
});

// Connect to the database
await client.connect();

try {
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
} catch (err) {
  // something wwent wrong - rollback changes
  await client.query("ROLLBACK");
  throw err;
}

console.log("database created.");

// Disconnect from the database
await client.end();

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
const langArr = [];

getTags(Area.tag)
  .then((tags) => {
    addTagsToDb(tags, Area.tag);
    console.log("tags added.");
  })
  .catch((err) => {
    console.log("error while inserting tags.");
    throw err;
  });

getTags(Area.artists)
  .then((artists) => {
    addTagsToDb(artists, Area.artist);
    console.log("artists added.");
  })
  .catch((err) => {
    console.log("error while inserting artists.");
    throw err;
  });

getTags(Area.characters)
  .then((characters) => {
    addTagsToDb(characters, Area.character);
    console.log("characters added.");
  })
  .catch((err) => {
    console.log("error while inserting characters.");
    throw err;
  });

getTags(Area.series)
  .then((series) => {
    addTagsToDb(series, Area.series);
    console.log("series added.");
  })
  .catch((err) => {
    console.log("error while inserting series.");
    throw err;
  });

for (let i = 0; i < 100; i++) {
  if (langs[i] !== undefined) langArr.push(langs[i]);
}

addLanguagesToDb(langArr)
  .then((res) => {
    console.log("languages added.");
  })
  .catch((err) => {
    console.log("error while inserting languages.");
    throw err;
  });
