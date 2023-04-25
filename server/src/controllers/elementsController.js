import Express from "express";
import { getElements } from "../utils/getElements.js";
import { validateElementsQueryParams } from "../utils/validateElementsQueryParams.js";

const router = Express.Router();

router.post("/query", async (req, res) => {
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

export const elementsController = router;