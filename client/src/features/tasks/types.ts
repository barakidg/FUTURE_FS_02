export interface Task {
  id: string;
  leadId: string;
  content: string;
  scheduledFor: string | null;
  taskStatus: "PENDING" | "DONE" | "CANCELLED" | null;
  isOverdue: boolean;
  createdAt: string;
  lead: { id: string; name: string };
}

export type TaskScope = "today" | "overdue";

export interface UpdateTaskStatusInput {
  noteId: string;
  taskStatus: "DONE" | "CANCELLED";
}