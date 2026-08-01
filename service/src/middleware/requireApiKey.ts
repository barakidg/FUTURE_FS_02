import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/error.js";

const LEAD_CAPTURE_PERMISSIONS = { leads: ["create"] };

export default async function requireApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const key = req.header("x-api-key");
    if (!key) {
      throw ApiError.unauthorized("Missing API key.");
    }

    const verification = await auth.api.verifyApiKey({
      body: { key, permissions: LEAD_CAPTURE_PERMISSIONS },
    });

    if (!verification.valid || !verification.key) {
      throw ApiError.unauthorized("Invalid or unauthorized API key.");
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { id: verification.key.id },
      select: { organizationId: true },
    });

    if (!apiKeyRecord?.organizationId) {
      throw ApiError.unauthorized("Invalid or unauthorized API key.");
    }

    const organization = await prisma.organization.findUnique({
      where: { id: apiKeyRecord.organizationId },
    });

    if (!organization || organization.status !== "ACTIVE") {
      throw ApiError.forbidden("This organization cannot accept leads right now.");
    }

    req.organization = organization;
    next();
  } catch (err) {
    next(err);
  }
}