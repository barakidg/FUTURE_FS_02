import type { Request, Response } from "express";
import * as emailService from "./service.js";
import { emailSchema } from "./schema.js";
import { idSchema } from "../leads/schema.js";

export const sendLeadEmail = async (req: Request, res: Response) => {
  const { id: leadId } = idSchema.parse(req.params);
  const input = emailSchema.parse(req.body);

  const note = await emailService.sendLeadEmail(
    req.organization!.id,
    req.organization!.name,
    leadId,
    { name: req.user!.name, email: req.user!.email },
    input,
  );

  res.status(201).json({ sent: true, note });
};