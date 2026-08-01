import { api } from "@/lib/axios";
import type { AuthUser, SignInInput, RegisterInput } from "./types";

export async function getSession(): Promise<AuthUser | null> {
  const { data } = await api.get<{ user: AuthUser } | null>("/api/auth/get-session");
  return data?.user ?? null;
}

export async function signIn(input: SignInInput): Promise<AuthUser> {
  const { data } = await api.post<{ user: AuthUser }>("/api/auth/sign-in/email", input);
  return data.user;
}

export async function registerGym(input: RegisterInput): Promise<AuthUser> {
  const { data } = await api.post<{ user: AuthUser }>("/api/register", input);
  return data.user;
}

export async function signOut(): Promise<void> {
  await api.post("/api/auth/sign-out");
}