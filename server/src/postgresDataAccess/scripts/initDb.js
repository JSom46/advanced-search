import { Area } from "../../utils/area.js";
import { addLanguagesToDb } from "../addLanguagesToDb.js";
import { addTagsToDb } from "../addTagsToDb.js";
import { getTagsFromHitomi } from "../../hitomiDataAccess/getTagsFromHitomi.js";

const langs = {"32":"mongolian","40":"chinese","20":"portuguese","29":"turkish","27":"tagalog","8":"english","10":"esperanto","37":"persian","16":"hungarian","36":"arabic","23":"slovak","4":"czech","28":"vietnamese","11":"french","34":"ukrainian","41":"japanese","5":"danish","14":"italian","35":"hebrew","17":"dutch","19":"polish","0":"indonesian","21":"romanian","39":"korean","3":"cebuano","18":"norwegian","31":"bulgarian","26":"swedish","38":"thai","30":"greek","2":"catalan","9":"spanish","13":"icelandic","24":"serbian","22":"albanian","6":"german","1":"javanese","7":"estonian","12":"hindi","33":"russian","25":"finnish","15":"latin"};
const langArr = [];

getTagsFromHitomi(Area.tag).then(tags => {
    addTagsToDb(Area.tag, tags);
});

getTagsFromHitomi(Area.artists).then(artists => {
    addTagsToDb(Area.artist, artists);
});

getTagsFromHitomi(Area.characters).then(characters => {
    addTagsToDb(Area.character, characters);
});

getTagsFromHitomi(Area.series).then(series => {
    addTagsToDb(Area.series, series);
});

for(let i = 0; i < 100; i++){
    if(langs[i] !== undefined) langArr.push(langs[i]);
}

await addLanguagesToDb(langArr);