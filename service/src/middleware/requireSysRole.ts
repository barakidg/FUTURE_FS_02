import type { Request, Response, NextFunction } from "express";
import { SystemRole } from "../generated/prisma/client.js";
import { ApiError } from "../lib/error.js";
import { logger } from "../lib/logger.js";

export default function requireSystemRole(
  ...allowedRoles: readonly [SystemRole, ...SystemRole[]]
) {
  return function (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    if (!req.user) {
      next(ApiError.unauthorized("Authentication required."));
      return;
    }

    const role = req.user.role;

    if (!role || !allowedRoles.includes(role)) {
      logger.warn(
        {
          userId: req.user.id,
          role,
          requiredRoles: allowedRoles,
          path: req.originalUrl,
        },
        "Forbidden: User does not have the required permissions.",
      );

      next(ApiError.forbidden());
      return;
    }

    next();
  };
}