export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
export type LeadQualification = "HOT" | "WARM" | "COLD" | null;

export interface Lead {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  interest: string | null;
  budget: string | null;
  message: string | null;
  wantsTrainer: boolean;
  sourceType: string;
  sourceDomain: string | null;
  status: LeadStatus;
  qualification: LeadQualification;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  interest?: string;
  budget?: string;
  message?: string;
  wantsTrainer?: boolean;
}

export interface LeadsQuery {
  status?: LeadStatus;
  qualification?: "HOT" | "WARM" | "COLD" | "UNSET";
  search?: string;
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

// Mirrors the backend's LEAD_STATUS_TRANSITIONS — kept in sync by hand, used only
// to grey out invalid choices client-side. The backend re-validates regardless.
export const LEAD_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ["CONTACTED", "CONVERTED", "LOST"],
  CONTACTED: ["CONVERTED", "LOST"],
  CONVERTED: [],
  LOST: [],
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New", CONTACTED: "Contacted", CONVERTED: "Converted", LOST: "Lost",
};

export const LEAD_QUALIFICATION_LABELS: Record<"HOT" | "WARM" | "COLD", string> = {
  HOT: "Hot", WARM: "Warm", COLD: "Cold",
};