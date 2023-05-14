import Express from "express";
import Utils from "../utils/utils.js";

const router = Express.Router();

router.get("/:area/:group", async (req, res) => {
  if (!Utils.validateTagsQueryParams(req.params.area, req.params.group))
    return res.sendStatus(400);

  try {
    const tags = await Utils.getTags(req.params.area, req.params.group);
    return res.status(200).send({ tags: tags });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export const tagsController = router;
