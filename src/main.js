import {} from "dotenv/config";
import Express from "express";

import { Area } from "./utils/area.js";
import { getElements } from "./utils/getElements.js";
import { elementsController } from "./controllers/elementsController.js";

//console.log(await getElements([{vals: [{area: Area.artist, val: 'ter', negate: false}, {area: Area.language, val: 'english', negate: false}, {area: Area.series, val: 'pokemon', negate: true}]}, {vals: [{area: Area.series, val: 'original', negate: false}]}]));
//console.log(await getElements([{vals: [{area: Area.artist, val: 'ter', negate: false}, {area: Area.language, val: 'english', negate: false}, {area: Area.series, val: 'pokemon', negate: true}]}, {vals: [{area: Area.artist, val: 'wakadori nikomi', negate: false}, {area: Area.language, val: 'english', negate: true}]}]));

const app = Express();

app.use(Express.json());
app.use(elementsController);

app.listen(process.env.SERVER_PORT || 7312, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT || 7312}.`);
});