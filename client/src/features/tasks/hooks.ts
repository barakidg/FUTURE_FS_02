import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import * as tasksApi from "./api";
import type { UpdateTaskStatusInput } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTasks(scope: "today" | "overdue") {
  return useQuery({ queryKey: queryKeys.tasks.list(scope), queryFn: () => tasksApi.listTasks(scope) });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskStatusInput) =>
      tasksApi.updateTaskStatus(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      toast.success("Task updated.");
    },

    onError: () => {
      toast.error("Couldn't update task.");
    },
  });
}

