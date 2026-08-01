import { z } from "zod";

export const noteSchema = z.object({
  content: z.string().trim().min(1, "Content is required").max(2000),
  scheduledFor: z.coerce.date().optional(),
});

export const noteParamsSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export const noteTaskParamsSchema = z.object({
  id: z.uuid("Invalid id format"),
  noteId: z.uuid("Invalid note id format"),
});
    
export type NoteInput = z.infer<typeof noteSchema>;

export const taskStatusSchema = z.object({
  taskStatus: z.enum(["DONE", "CANCELLED"]),
});

export const taskScopeSchema = z.object({
  scope: z.enum(["today", "overdue"]).optional().default("today"),
});
export type TaskScopeQuery = z.infer<typeof taskScopeSchema>;

export const noteIdParamSchema = z.object({
  noteId: z.string().min(1, "Missing required parameter: noteId"),
});