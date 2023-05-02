import Express from "express";
import { elementsController } from "./controllers/elementsController.js";
import { tagsController } from "./controllers/tagsController.js";

const app = Express();

app.use(Express.json());
app.use("/elements", elementsController);
app.use("/tags", tagsController);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT || 8080}.`);
});
