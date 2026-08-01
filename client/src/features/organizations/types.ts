export type OrganizationStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  leadCount: number;
  memberCount: number;
}

export interface OrganizationDetail {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  members: { user: { id: string; name: string; email: string } }[];
  _count: { leads: number; members: number };
}

export interface OrganizationsQuery {
  status?: OrganizationStatus;
  sortBy: "createdAt" | "name";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};