import { api } from "@/lib/axios";
import type { ApiKeyCreated, ApiKeyInfo } from "./types";

export async function getApiKey(): Promise<ApiKeyInfo | null> {
  const { data } = await api.get<ApiKeyInfo | null>("/api/api-keys");
  return data;
}

export async function createApiKey(name?: string): Promise<ApiKeyCreated> {
  const { data } = await api.post<ApiKeyCreated>("/api/api-keys", { name });
  return data;
}

export async function rotateApiKey(name?: string): Promise<ApiKeyCreated> {
  const { data } = await api.post<ApiKeyCreated>("/api/api-keys/rotate", { name });
  return data;
}