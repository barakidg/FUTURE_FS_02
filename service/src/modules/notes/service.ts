import type { Note, TaskStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { encrypt, decrypt } from "../encryption/cipher.js";
import { ApiError } from "../../lib/error.js";
import type { NoteInput, TaskScopeQuery } from "./schema.js";

function isOverdue(note: Pick<Note, "scheduledFor" | "taskStatus">): boolean {
  return note.taskStatus === "PENDING" && note.scheduledFor !== null && note.scheduledFor.getTime() < Date.now();
}

function decryptNote(note: Note) {
  return {
    id: note.id,
    leadId: note.leadId,
    content: decrypt(note.contentEnc),
    scheduledFor: note.scheduledFor,
    taskStatus: note.taskStatus,
    isOverdue: isOverdue(note),
    createdAt: note.createdAt,
  };
}

async function assertLeadInOrg(organizationId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId }, select: { id: true } });
  if (!lead) {
    throw ApiError.notFound("Lead not found.");
  }
}

export async function addNote(organizationId: string, leadId: string, input: NoteInput) {
  await assertLeadInOrg(organizationId, leadId);

  const note = await prisma.note.create({
    data: {
      leadId,
      organizationId,
      contentEnc: encrypt(input.content),
      scheduledFor: input.scheduledFor ?? null,
      taskStatus: input.scheduledFor ? "PENDING" : null,
    },
  });

  return decryptNote(note);
}

export async function notesForLead(organizationId: string, leadId: string) {
  await assertLeadInOrg(organizationId, leadId);

  const notes = await prisma.note.findMany({
    where: { leadId, organizationId },
    orderBy: { createdAt: "desc" },
  });

  return notes.map(decryptNote);
}
export async function updateNoteTaskStatus(
  organizationId: string,
  noteId: string,
  taskStatus: Extract<TaskStatus, "DONE" | "CANCELLED">,
) {
  const note = await prisma.note.findFirst({ where: { id: noteId, organizationId } });

  if (!note) {
    throw ApiError.notFound("Note not found.");
  }
  if (note.taskStatus === null) {
    throw ApiError.conflict("This note has no schedule to update.");
  }
  if (note.taskStatus !== "PENDING") {
    throw ApiError.conflict(`This task is already ${note.taskStatus.toLowerCase()}.`);
  }

  const updated = await prisma.note.update({ where: { id: noteId }, data: { taskStatus } });
  return decryptNote(updated);
}

export async function listOrganizationTasks(organizationId: string, scope: TaskScopeQuery["scope"]) {
  const now = new Date();
  const scheduledFor =
    scope === "today"
      ? { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()), lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) }
      : { lt: now };

  const notes = await prisma.note.findMany({
    where: { organizationId, taskStatus: "PENDING", scheduledFor },
    include: { lead: { select: { id: true, name: true } } },
    orderBy: { scheduledFor: "asc" },
  });

  return notes.map((note) => ({ ...decryptNote(note), lead: note.lead }));
}