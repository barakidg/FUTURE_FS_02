import { Router } from "express";
import requireAuth from "../../middleware/requireAuth.js";
import requireSysRole from "../../middleware/requireSysRole.js";
import * as adminController from "./controller.js";
import { SystemRole } from "../../generated/prisma/client.js";

const adminRouter = Router();

adminRouter.use(requireAuth, requireSysRole(SystemRole.SUPER_ADMIN));

adminRouter.get("/organizations", adminController.listOrganizations);
adminRouter.get("/organizations/:id", adminController.getOrganization);
adminRouter.patch("/organizations/:id/status", adminController.updateOrganizationStatus);

export default adminRouter;