import { Router } from "express";
import * as noteController from "./controller.js";
import requireAuth from "../../middleware/requireAuth.js";
import requireMemRole from "../../middleware/requireMemRole.js";

export const notesRouter = Router({ mergeParams: true });
notesRouter.get("/", noteController.notesForLead);
notesRouter.post("/", noteController.addNote);
notesRouter.patch("/:noteId/task-status", noteController.updateNoteTaskStatus);

export const tasksRouter = Router();
tasksRouter.use(requireAuth, requireMemRole("ADMIN"));
tasksRouter.get("/", noteController.listTasks);
tasksRouter.patch("/:noteId/task-status", noteController.updateNoteTaskStatus);

export default notesRouter;