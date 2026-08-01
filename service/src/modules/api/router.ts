import { Router } from "express";
import * as apiKeyController from "./controller.js";
import requireAuth from "../../middleware/requireAuth.js";
import requireMemRole from "../../middleware/requireMemRole.js";

const apiRouter = Router();

apiRouter.use(requireAuth, requireMemRole("ADMIN"));

apiRouter.get("/", apiKeyController.getApiKey);
apiRouter.post("/", apiKeyController.createApiKey);
apiRouter.post("/rotate", apiKeyController.rotateApiKey);

export default apiRouter;