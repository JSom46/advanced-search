import Express from "express";
import { getTags } from "../utils/getTags.js";
import { validateTagsQueryParams } from "../utils/validateTagsQueryParams.js";

const router = Express.Router();

router.get("/:area/:group", async (req, res) => {
  if (!validateTagsQueryParams(req.params.area, req.params.group))
    return res.sendStatus(400);

  try {
    const tags = await getTags(req.params.area, req.params.group);
    return res.status(200).send({ tags: tags });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export const tagsController = router;
