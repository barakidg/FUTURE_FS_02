import type { Request, Response } from "express";
import { registerSchema } from "./schema.js";
import { registerGym } from "./service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const { user, token, headers } = await registerGym(input);
  const cookies = headers.getSetCookie();
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  res.status(201).json({ message: "Registration completed successfully.", user, token });
}
