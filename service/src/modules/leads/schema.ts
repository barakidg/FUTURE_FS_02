import { z } from "zod";
import { LeadStatus, LeadQualification } from "../../generated/prisma/client.js";

export interface LeadMeta {
  organizationId: string;
  sourceType: string;
  sourceDomain?: string | null;
}

const leadBaseSchema = z.object({
  name: z.string().trim().max(255),
  email: z.email().optional(),
  phone: z.string().trim().max(20).optional(),
  interest: z.string().trim().max(255).optional(),
  budget: z.string().trim().max(255).optional(),
  message: z.string().trim().max(2000).optional(),
  wantsTrainer: z.boolean().optional(),
  label: z.string().max(120).optional(),
});

export const leadInputSchema = leadBaseSchema.superRefine((value, ctx) => {
  if (!value.email && !value.phone) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Either email or phone is required" });
  }
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export interface DecipheredLead {
    id: string;
    organizationId: string;
    name: string;
    email: string | null;
    phone: string | null;
    interest: string | null;
    budget: string | null;
    message: string | null;
    wantsTrainer: boolean;
    label: string | null;
    sourceType: string;
    sourceDomain: string | null;
    status: LeadStatus;
    qualification: LeadQualification | null;
    createdAt: Date;
    updatedAt: Date;
}

export const listLeadsQuerySchema = z.object({
    status: z.enum(LeadStatus).optional(),
    qualification: z.union([z.enum(LeadQualification), z.literal("UNSET")]).optional(),
    wantsTrainer: z.coerce.boolean().optional(),
    search: z.string().trim().max(200).optional(),
    sortBy: z.enum(["createdAt", "name"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().optional().default(20)
});

export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;

export const statusUpdateSchema = z.object({
    status: z.enum(LeadStatus)
});

export const qualificationUpdateSchema = z.object({
    qualification: z.enum(LeadQualification)
});

export const idSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export const LEAD_SOURCE_TYPES = { WEB_FORM: "web_form", MANUAL: "manual" } as const;
export type LeadSourceType = (typeof LEAD_SOURCE_TYPES)[keyof typeof LEAD_SOURCE_TYPES];

export const leadUpdateSchema = leadBaseSchema.partial();
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;