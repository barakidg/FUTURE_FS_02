import { api } from "@/lib/axios";
import type { OrganizationDetail, OrganizationsQuery, OrganizationStatus, OrganizationSummary, PaginatedResult } from "./types";

export async function listOrganizations(query: OrganizationsQuery): Promise<PaginatedResult<OrganizationSummary>> {
  const { data } = await api.get<PaginatedResult<OrganizationSummary>>("/api/admin/organizations", { params: query });
  return data;
}

export async function getOrganization(id: string): Promise<OrganizationDetail> {
  const { data } = await api.get<OrganizationDetail>(`/api/admin/organizations/${id}`);
  return data;
}

export async function updateOrganizationStatus(id: string, status: OrganizationStatus): Promise<OrganizationSummary> {
  const { data } = await api.patch<OrganizationSummary>(`/api/admin/organizations/${id}/status`, { status });
  return data;
}