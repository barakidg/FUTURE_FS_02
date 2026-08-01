import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import * as organizationsApi from "./api";
import type { OrganizationsQuery, OrganizationStatus } from "./types";

export function useOrganizations(query: OrganizationsQuery) {
  return useQuery({
    queryKey: queryKeys.organizations.list(query),
    queryFn: () => organizationsApi.listOrganizations(query),
    placeholderData: (previousData) => previousData,
  });
}

export function useOrganization(id: string | null) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id ?? ""),
    queryFn: () => organizationsApi.getOrganization(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrganizationStatus }) => organizationsApi.updateOrganizationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "list"] });
      toast.success("Gym status updated");
    },
  });
}

export function useBulkUpdateOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: OrganizationStatus }) =>
      Promise.all(ids.map((id) => organizationsApi.updateOrganizationStatus(id, status))),
    onSuccess: (_data, { ids }) => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "list"] });
      toast.success(ids.length === 1 ? "Gym updated" : `${ids.length} gyms updated`);
    },
    onError: () => toast.error("Couldn't update the selected gyms."),
  });
}