import { pool } from "./pgCon.js";
import { Area } from "../utils/area.js";

export const getOutdatedTags = async (params) => {
    const tags = [];
    const artists = [];
    const characters = [];
    const languages = [];
    const series = [];

    params.forEach(s => {
        s.vals.forEach(e => {
            switch(e.area){
                case Area.language:{
                    if(languages.indexOf(e.val == -1)) languages.push(e.val);                   
                    break;
                }
                case Area.character:{
                    if(languages.indexOf(e.val == -1)) characters.push(e.val);                   
                    break;
                }
                case Area.tag:{
                    if(languages.indexOf(e.val == -1)) tags.push(e.val);                    
                    break;
                }
                case Area.series:{
                    if(languages.indexOf(e.val == -1)) series.push(e.val);
                    break;
                }
                case Area.artist:{
                    if(languages.indexOf(e.val == -1)) artists.push(e.val);
                    break;
                }
                default:{
                    throw `Invalid area: ${e.area}.`;
                }
            }
        });
    });

    console.log([languages, characters, tags, series, artists])

    const outdatedTags = await pool.query(`
        SELECT name, area FROM 
            ((SELECT '' name, (SELECT COUNT(1) FROM updates WHERE update_date = CURRENT_DATE AND updated_table = 'elements') area) UNION

            (SELECT t.name, 0 area FROM languages t WHERE 
                (t.name IN (SELECT unnest($1::text[])) AND (t.last_updated IS NULL OR t.last_updated < CURRENT_DATE - INTERVAL '1 day'))) UNION

            (SELECT t.name, 1 area FROM characters t WHERE 
                (t.name IN (SELECT unnest($2::text[])) AND (t.last_updated IS NULL OR t.last_updated < CURRENT_DATE - INTERVAL '1 day'))) UNION

            (SELECT t.name, 2 area FROM tags t WHERE 
                (t.name IN (SELECT unnest($3::text[])) AND (t.last_updated IS NULL OR t.last_updated < CURRENT_DATE - INTERVAL '1 day'))) UNION

            (SELECT t.name, 3 area FROM series t WHERE 
                (t.name IN (SELECT unnest($4::text[])) AND (t.last_updated IS NULL OR t.last_updated < CURRENT_DATE - INTERVAL '1 day'))) UNION

            (SELECT t.name, 4 area FROM artists t WHERE 
                (t.name IN (SELECT unnest($5::text[])) AND (t.last_updated IS NULL OR t.last_updated < CURRENT_DATE - INTERVAL '1 day')))) outdated_tags
    `, [languages, characters, tags, series, artists]);

    console.log(outdatedTags.rows)

    const indexOutOfDateIdx = outdatedTags.rows.findIndex(e => e.name === "");

    const indexOutOfDate = outdatedTags.rows[indexOutOfDateIdx].area == 0;
    outdatedTags.rows.splice(indexOutOfDateIdx, 1);

    return {
        indexOutOfDate: indexOutOfDate, 
        tags: outdatedTags.rows
    };
}