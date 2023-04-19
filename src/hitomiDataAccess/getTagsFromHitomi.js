import * as cheerio from 'cheerio';
import { Area, areaToString } from "./area.js";
import { pool } from "../postgresDataAccess/pgCon.js";

export const getTagsFromHitomi = async (area) => {
    if(area == Area.language){
        return (await pool.query("SELECT id, name FROM languages;")).rows;
    }
    else{
        const urls = process.env.TAGS_GROUPS.split(',').map(group => {
            return `https://hitomi.la/all${areaToString(area, true)}-${group}.html`;
        });

        const promises = urls.map(url => fetch(url));
        const responses = await Promise.all(promises);
        const htmls = await Promise.all(responses.map(response => response.text()));
        const res = [];
        
        htmls.forEach(html => {
            const $ = cheerio.load(html);
            $("ul.posts a").each(function(){
                res.push(this.attribs.href
                    .replace(/^\/[a-zA-Z0-9%]+\/([a-zA-Z0-9%]+)\-[a-zA-Z0-9%]+\.html/, '$1')
                    .replace(/%20/g, ' ')
                    .replace(/%2D/g, '-')
                    .replace(/%3A/g, ':')
                    .replace(/%2E/g, '.')
                );
            });
        });

        return res;
    }
};