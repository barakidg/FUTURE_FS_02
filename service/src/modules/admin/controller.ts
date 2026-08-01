import type { Request, Response } from "express";
import * as adminService from "./service.js";
import { listOrganizationsQuerySchema, idSchema, updateOrganizationStatusSchema } from "./schema.js";

export const listOrganizations = async (req: Request, res: Response) => {
  const query = listOrganizationsQuerySchema.parse(req.query);
  const result = await adminService.listOrganizations(query);
  res.json(result);
};

export const getOrganization = async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  const organization = await adminService.getOrganizationById(id);
  res.json(organization);
};

export const updateOrganizationStatus = async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  const { status } = updateOrganizationStatusSchema.parse(req.body);
  const organization = await adminService.updateOrganizationStatus(id, status);
  res.json(organization);
};