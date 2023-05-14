import pg from "pg";
const { Pool } = pg;

import addTagElementsToDb from "./addTagElementsToDb.js";
import addElementsToDb from "./addElementsToDb.js";
import getOutdatedTags from "./getOutdatedTags.js";
import addLanguagesToDb from "./addLanguagesToDb.js";
import addTagsToDb from "./addTagsToDb.js";
import generateElementsDbQuery from "./generateElementsDbQuery.js";
import generateTagsDbQuery from "./generateTagsDbQuery.js";
import getElementsFromDb from "./getElementsFromDb.js";
import getTagsFromDb from "./getTagsFromDB.js";

export default class PostgresDataAccess {
  static pool = new pg.Pool({
    user: process.env.PG_USER,
    database: process.env.DB_NAME,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
  });

  static addTagElementsToDb = addTagElementsToDb;
  static addElementsToDb = addElementsToDb;
  static getOutdatedTags = getOutdatedTags;
  static getElementsFromDb = getElementsFromDb;
  static getTagsFromDb = getTagsFromDb;
  static addLanguagesToDb = addLanguagesToDb;
  static addTagsToDb = addTagsToDb;
  static generateElementsDbQuery = generateElementsDbQuery;
  static generateTagsDbQuery = generateTagsDbQuery;
}
