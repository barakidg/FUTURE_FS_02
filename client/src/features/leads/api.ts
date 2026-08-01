import { api } from "@/lib/axios";
import type { Lead, LeadInput, LeadsQuery, LeadStatus, LeadQualification, PaginatedResult } from "./types";

export async function listLeads(query: LeadsQuery): Promise<PaginatedResult<Lead>> {
  const { data } = await api.get<PaginatedResult<Lead>>("/api/leads", { params: query });
  return data;
}

export async function getLead(id: string): Promise<Lead> {
  const { data } = await api.get<Lead>(`/api/leads/${id}`);
  return data;
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const { data } = await api.post<Lead>("/api/leads", input);
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  await api.delete(`/api/leads/${id}`);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const { data } = await api.patch<Lead>(`/api/leads/${id}/status`, { status });
  return data;
}

export async function updateLeadQualification(id: string, qualification: LeadQualification): Promise<Lead> {
  const { data } = await api.patch<Lead>(`/api/leads/${id}/qualification`, { qualification });
  return data;
}