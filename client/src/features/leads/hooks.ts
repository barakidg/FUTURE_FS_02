import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import * as leadsApi from "./api";
import type { LeadInput, LeadsQuery, LeadStatus, LeadQualification } from "./types";

export function useLeads(query: LeadsQuery) {
  return useQuery({
    queryKey: queryKeys.leads.list(query),
    queryFn: () => leadsApi.listLeads(query),
    placeholderData: (previousData) => previousData, // table stays stable while paging/filtering
  });
}

export function useLead(id: string | null) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id ?? ""),
    queryFn: () => leadsApi.getLead(id!),
    enabled: Boolean(id),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LeadInput) => leadsApi.createLead(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      toast.success("Lead added");
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      toast.success("Lead deleted");
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => leadsApi.updateLeadStatus(id, status),
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      queryClient.setQueryData(queryKeys.leads.detail(lead.id), lead);
    },
  });
}

export function useUpdateLeadQualification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, qualification }: { id: string; qualification: LeadQualification }) =>
      leadsApi.updateLeadQualification(id, qualification),
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      queryClient.setQueryData(queryKeys.leads.detail(lead.id), lead);
    },
  });
}

export function useBulkDeleteLeads() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => leadsApi.deleteLead(id))),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      toast.success(ids.length === 1 ? "Lead deleted" : `${ids.length} leads deleted`);
    },
    onError: () => toast.error("Couldn't delete the selected leads."),
  });
}