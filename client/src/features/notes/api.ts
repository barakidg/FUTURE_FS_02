import { api } from "@/lib/axios";
import type { Note, NoteInput } from "./types";

export async function listNotes(leadId: string): Promise<Note[]> {
  const { data } = await api.get<Note[]>(`/api/leads/${leadId}/notes`);
  return data;
}

export async function createNote(leadId: string, input: NoteInput): Promise<Note> {
  const { data } = await api.post<Note>(`/api/leads/${leadId}/notes`, input);
  return data;
}
