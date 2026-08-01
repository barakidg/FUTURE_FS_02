import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import * as apiKeysApi from "./api";

export function useApiKey() {
  return useQuery({ queryKey: queryKeys.apiKey, queryFn: apiKeysApi.getApiKey });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name?: string) => apiKeysApi.createApiKey(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.apiKey }),
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name?: string) => apiKeysApi.rotateApiKey(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.apiKey }),
  });
}