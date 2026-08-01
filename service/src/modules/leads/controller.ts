import type { Request, Response } from "express";
import * as leadService from "./service.js";
import { listLeadsQuerySchema, idSchema, statusUpdateSchema, qualificationUpdateSchema, LEAD_SOURCE_TYPES, leadInputSchema, leadUpdateSchema } from "./schema.js";

export const listLeads = async (req: Request, res: Response) => {
    const query = listLeadsQuerySchema.parse(req.query);
    const result = await leadService.listLeads(req.organization!.id, query);
    res.json(result);
}

export const getLead = async (req: Request, res: Response) => {
    const lead = await leadService.getLeadById(req.organization!.id, idSchema.parse(req.params).id);
    res.json(lead);
}

export const updateLeadStatus = async (req: Request, res: Response) => {
    const { status }  = statusUpdateSchema.parse(req.body);
    const lead = await leadService.updateLeadStatus(req.organization!.id, idSchema.parse(req.params).id, status);
    res.json(lead);
}

export const updateLeadQualification = async (req: Request, res: Response) => {
    const { qualification } = qualificationUpdateSchema.parse(req.body);
    const lead = await leadService.updateLeadQualification(req.organization!.id, idSchema.parse(req.params).id, qualification);
    res.json(lead);
}

export const createLead = async (req: Request, res: Response) => {
  const input = leadInputSchema.parse(req.body);
  const lead = await leadService.createLead(input, {
    organizationId: req.organization!.id,
    sourceType: LEAD_SOURCE_TYPES.MANUAL,
    sourceDomain: null,
  });
  res.status(201).json(lead);
};

export const updateLead = async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  const input = leadUpdateSchema.parse(req.body);
  const lead = await leadService.updateLead(req.organization!.id, id, input);
  res.json(lead);
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  await leadService.deleteLead(req.organization!.id, id);
  res.status(204).send();
};