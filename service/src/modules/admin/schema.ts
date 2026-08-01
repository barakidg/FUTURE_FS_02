import { z } from "zod";
import { OrganizationStatus } from "../../generated/prisma/client.js";

export const listOrganizationsQuerySchema = z.object({
  status: z.enum(OrganizationStatus).optional(),
  search: z.string().trim().max(200).optional(),
  sortBy: z.enum(["createdAt", "name"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(20),
});
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;

export const idSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export const updateOrganizationStatusSchema = z.object({
  status: z.enum(OrganizationStatus),
});
export type UpdateOrganizationStatusInput = z.infer<typeof updateOrganizationStatusSchema>;