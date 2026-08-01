import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../lib/error.js";
import { logger } from "../lib/logger.js";


function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): ApiError | null {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.["target"] as string[] | undefined)?.join(", ") ?? "field";
      return ApiError.conflict(`A record with this ${target} already exists`);
    }
    case "P2025":
      return ApiError.notFound("Requested record not found");
    case "P2023":
      return ApiError.badRequest("Invalid id format");
    default:
      return null;
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.fatal({ err }, "Database connection failed");
    err = ApiError.serviceUnavailable("Database is temporarily unavailable.");
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = mapPrismaError(err);
    if (mapped) {
      err = mapped;
    }
  }

  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path }, "Unhandled ApiError");
    }
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: z.flattenError(err),
      },
    });
    return;
  }

  logger.error({ err, path: req.path }, "Unexpected error");
  res.status(500).json(ApiError.internal().toJSON());
}