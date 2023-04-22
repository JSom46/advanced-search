import Express from "express";
import { getElements } from "../utils/getElements.js";
import { getTags } from "../utils/getTags.js";
import { validateElementsQueryParams } from "../utils/validateElementsQueryParams.js";
import { validateTagsQueryParams } from "../utils/validateTagsQueryParams.js";

const router = Express.Router();

router.post("/", async (req, res) => {
    req.body.params = req.body.params || [];
    if(!validateElementsQueryParams(req.body.params, req.body.page, req.body.pageSize)) return res.sendStatus(400);

    console.log(req.body.page);
    console.log(req.body.pageSize)

    try{
        const elements = await getElements(req.body.params, req.body.page, req.body.pageSize);
        return res.status(200).send({elements: elements});
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

router.get("/tags/:area/:group?", async (req, res) => {
    if(!validateTagsQueryParams(req.params.area, req.params.group)) return res.sendStatus(400);

    try{
        const tags = await getTags(req.params.area, req.params.group);
        return res.status(200).send({tags: tags});
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

export const elementsController = router;