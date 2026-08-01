import type { Request, Response, NextFunction } from "express";
import { MemberRole } from "../generated/prisma/client.js";
import { ApiError } from "../lib/error.js";
import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";

export default function requireMemberRole(
  ...allowedRoles: readonly [MemberRole, ...MemberRole[]]
) {
  return async function requireMemberRoleMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized("Authentication required.");
      }

      const member = await prisma.member.findFirst({
        where: { userId: req.user.id },
        include: { organization: true },
      });

      if (!member) {
        throw ApiError.forbidden("You are not a member of any organization.");
      }

      if (member.organization.status !== "ACTIVE") {
        throw ApiError.forbidden("This organization is not active.");
      }

      if (!allowedRoles.includes(member.role)) {
        logger.warn(
          {
            userId: req.user.id,
            memberRole: member.role,
            organizationId: member.organizationId,
            requiredRoles: allowedRoles,
            path: req.originalUrl,
          },
          "Forbidden: member role check failed.",
        );
        throw ApiError.forbidden();
      }

      req.member = member;
      req.organization = member.organization;

      next();
    } catch (err) {
      next(err);
    }
  };
}