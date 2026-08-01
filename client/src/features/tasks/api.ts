import type { TaskScope, Task, UpdateTaskStatusInput } from "./types";
import { api } from "@/lib/axios";


export async function listTasks(scope: TaskScope): Promise<Task[]> {
  const { data } = await api.get<Task[]>("/api/tasks", {
    params: { scope },
  });

  return data;
}

export async function updateTaskStatus({
  noteId,
  taskStatus,
}: UpdateTaskStatusInput): Promise<Task> {
  const { data } = await api.patch<Task>(
    `/api/tasks/${noteId}/task-status`,
    { taskStatus },
  );

  return data;
}