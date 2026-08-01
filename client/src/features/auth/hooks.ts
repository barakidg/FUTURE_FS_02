import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import * as authApi from "./api";
import type { SignInInput, RegisterInput } from "./types";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: authApi.getSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: SignInInput) => authApi.signIn(input),
    onSuccess: (user) => {
      queryClient.clear(); 
      queryClient.setQueryData(queryKeys.session, user);
      navigate("/", { replace: true });
    },
  });
}

export function useRegisterGym() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.registerGym(input),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(queryKeys.session, user);
      navigate("/", { replace: true });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.clear();
      navigate("/sign-in", { replace: true });
      toast.success("Signed out");
    },
  });
}