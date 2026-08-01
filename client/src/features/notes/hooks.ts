import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import * as notesApi from "./api";
import type { NoteInput } from "./types";

export function useNotes(leadId: string | null) {
  return useQuery({
    queryKey: queryKeys.notes.list(leadId ?? ""),
    queryFn: () => notesApi.listNotes(leadId!),
    enabled: Boolean(leadId),
  });
}

export function useCreateNote(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NoteInput) => notesApi.createNote(leadId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.list(leadId) });
      queryClient.invalidateQueries({ queryKey: ["tasks", "list"] });
      toast.success("Note added");
    },
  });
}
