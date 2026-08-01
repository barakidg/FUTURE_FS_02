import { z } from "zod";

export const emailSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});
export type emailInput = z.infer<typeof emailSchema>;