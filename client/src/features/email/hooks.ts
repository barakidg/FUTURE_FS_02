import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import * as emailApi from "./api";
import type { SendEmailInput } from "./types";

export function useSendLeadEmail(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendEmailInput) => emailApi.sendLeadEmail(leadId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.list(leadId) });
      toast.success("Email sent");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? "Failed to send email";
      toast.error(message);
    },
  });
}
