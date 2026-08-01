import type { Request, Response } from "express";
import * as analyticsService from "./service.js";
import { periodQuerySchema } from "./schema.js";

export const getPlatformAnalytics = async (req: Request, res: Response) => {
  const { period } = periodQuerySchema.parse(req.query);
  res.json(await analyticsService.getPlatformAnalytics(period));
};

export const getGymAnalytics = async (req: Request, res: Response) => {
  const { period } = periodQuerySchema.parse(req.query);
  res.json(await analyticsService.getGymAnalytics(req.organization!.id, period));
};

export const getGymLeadsTimeseries = async (req: Request, res: Response) => {
  const { period } = periodQuerySchema.parse(req.query);
  res.json(await analyticsService.getGymLeadsTimeseries(req.organization!.id, period));
};