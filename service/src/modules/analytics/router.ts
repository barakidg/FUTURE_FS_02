import { Router } from "express";
import requireAuth from "../../middleware/requireAuth.js";
import requireSysRole from "../../middleware/requireSysRole.js";
import requireMemRole from "../../middleware/requireMemRole.js";
import * as analyticsController from "./controller.js";
import { SystemRole, MemberRole } from "../../generated/prisma/client.js";

const analyticsRouter = Router();

analyticsRouter.get(
  "/platform",
  requireAuth,
  requireSysRole(SystemRole.SUPER_ADMIN),
  analyticsController.getPlatformAnalytics,
);

analyticsRouter.get(
  "/gym",
  requireAuth,
  requireMemRole(MemberRole.ADMIN),
  analyticsController.getGymAnalytics,
);

analyticsRouter.get("/gym/timeseries", requireAuth, requireMemRole("ADMIN"), analyticsController.getGymLeadsTimeseries);

export default analyticsRouter;