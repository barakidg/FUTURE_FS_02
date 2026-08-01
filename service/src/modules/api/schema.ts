import { z } from "zod";

export const apiKeyNameSchema = z.object({
  name: z.string().trim().min(1).max(100).optional().default("Website capture key"),
});
