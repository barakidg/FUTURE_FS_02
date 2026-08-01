import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { ApiError } from "../lib/error.js";

export default async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!result) {
      throw ApiError.unauthorized("Authentication required.");
    }

    req.user = {
        ...result.user,
        role: result.user.role ?? null
    };

    req.session = result.session;

    next();
  } catch (err) {
    next(err);
  }
}