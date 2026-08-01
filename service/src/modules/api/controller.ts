import type { Request, Response } from "express";
import * as apiKeyService from "./service.js";
import { apiKeyNameSchema } from "./schema.js";

export const getApiKey = async (req: Request, res: Response) => {
  const apiKey = await apiKeyService.findActiveKey(req.organization!.id);
  res.json(apiKey);
};

export const createApiKey = async (req: Request, res: Response) => {
  const { name } = apiKeyNameSchema.parse(req.body);
  const apiKey = await apiKeyService.createApiKey(req.organization!.id, req.user!.id, name);
  res.status(201).json(apiKey);
};

export const rotateApiKey = async (req: Request, res: Response) => {
  const { name } = apiKeyNameSchema.parse(req.body);
  const apiKey = await apiKeyService.rotateApiKey(req.organization!.id, req.user!.id, name);
  res.json(apiKey);
};