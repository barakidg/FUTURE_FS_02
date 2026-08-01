import { Router } from "express";
import { 
    listLeads, 
    getLead, 
    createLead, 
    updateLeadStatus, 
    updateLeadQualification,
    updateLead,
    deleteLead 
} from "./controller.js";
import requireAuth from "../../middleware/requireAuth.js";
import requireMemRole from "../../middleware/requireMemRole.js";
import { notesRouter } from "../notes/router.js";
import emailRouter from "../email/router.js";

const leadRouter = Router();

leadRouter.use(requireAuth, requireMemRole("ADMIN"));
leadRouter.get("/", listLeads);
leadRouter.post("/", createLead);
leadRouter.get("/:id", getLead);
leadRouter.patch("/:id/status", updateLeadStatus);
leadRouter.patch("/:id/qualification", updateLeadQualification);
leadRouter.use("/:id/notes", notesRouter);
leadRouter.use("/:id/email", emailRouter);
leadRouter.patch("/:id", updateLead);
leadRouter.delete("/:id", deleteLead);

export default leadRouter;