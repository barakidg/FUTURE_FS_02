export interface Note {
  id: string;
  leadId: string;
  content: string;
  scheduledFor: string | null;
  taskStatus: "PENDING" | "DONE" | "CANCELLED" | null;
  isOverdue: boolean;
  createdAt: string;
}

export interface NoteInput {
  content: string;
  scheduledFor?: Date;
}
