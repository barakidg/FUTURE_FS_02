import { Router } from "express";

import { register } from "./controller.js";

const authRouter = Router();

authRouter.post("/", register);

export default authRouter;