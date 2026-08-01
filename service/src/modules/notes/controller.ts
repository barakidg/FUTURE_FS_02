import type { Request, Response } from "express";
import * as noteService from "./service.js";
import { noteParamsSchema, noteIdParamSchema, noteSchema, taskStatusSchema, taskScopeSchema } from "./schema.js";

export const addNote = async (req: Request, res: Response) => {
  const { id: leadId } = noteParamsSchema.parse(req.params);
  const input = noteSchema.parse(req.body);
  const note = await noteService.addNote(req.organization!.id, leadId, input);
  res.status(201).json(note);
};

export const notesForLead = async (req: Request, res: Response) => {
  const { id: leadId } = noteParamsSchema.parse(req.params);
  const notes = await noteService.notesForLead(req.organization!.id, leadId);
  res.json(notes);
};

export const updateNoteTaskStatus = async (req: Request, res: Response) => {
  const { noteId } = noteIdParamSchema.parse(req.params);
  const { taskStatus } = taskStatusSchema.parse(req.body);
  const note = await noteService.updateNoteTaskStatus(req.organization!.id, noteId, taskStatus);
  res.json(note);
};

export const listTasks = async (req: Request, res: Response) => {
  const { scope } = taskScopeSchema.parse(req.query);
  const tasks = await noteService.listOrganizationTasks(req.organization!.id, scope);
  res.json(tasks);
};