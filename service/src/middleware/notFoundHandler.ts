import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/error.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
    next(ApiError.notFound(`The requested resource ${req.method} ${req.originalUrl} was not found`));
}