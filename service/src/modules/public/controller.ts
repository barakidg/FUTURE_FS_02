import type { Request, Response } from "express";
import { leadInputSchema, LEAD_SOURCE_TYPES } from "../leads/schema.js";
import { createLead } from "../leads/service.js";

export const captureLead = async (req: Request, res: Response) => {
  if (typeof req.body?.website === "string" && req.body.website.trim().length > 0) {
    res.status(201).json({ success: true });
    return;
  }

  const input = leadInputSchema.parse(req.body);

  const lead = await createLead(input, {
    organizationId: req.organization!.id,
    sourceType: LEAD_SOURCE_TYPES.WEB_FORM,
    sourceDomain: req.header("origin") ?? req.header("referer") ?? null,
  });

  res.status(201).json({ success: true, leadId: lead.id });
};