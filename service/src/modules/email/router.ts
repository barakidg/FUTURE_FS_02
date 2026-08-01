import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { sendLeadEmail } from "./controller.js";

const emailRouter = Router({ mergeParams: true });

const sendEmailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? ""),
});

emailRouter.post("/", sendEmailRateLimit, sendLeadEmail);

export default emailRouter;