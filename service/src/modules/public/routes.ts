import { Router } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import requireApiKey from "../../middleware/requireApiKey.js";
import { captureLead } from "./controller.js";

const publicRouter = Router();

publicRouter.use(cors());

const captureRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

publicRouter.post("/leads", captureRateLimit, requireApiKey, captureLead);

export default publicRouter;