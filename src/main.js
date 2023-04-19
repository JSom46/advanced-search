import {} from "dotenv/config";
import { Area } from "./utils/area.js";

import Express from "express";

import { getElements } from "./utils/getElements.js";

//console.log(await getElements([{vals: [{area: Area.artist, val: 'ter', negate: false}, {area: Area.language, val: 'english', negate: false}, {area: Area.series, val: 'pokemon', negate: true}]}, {vals: [{area: Area.series, val: 'original', negate: false}]}]));
console.log(await getElements([{vals: [{area: Area.artist, val: 'ter', negate: false}, {area: Area.language, val: 'english', negate: false}, {area: Area.series, val: 'pokemon', negate: true}]}, {vals: [{area: Area.artist, val: 'wakadori nikomi', negate: false}, {area: Area.language, val: 'english', negate: true}]}]));


