import { z } from "zod";
import type { RegisterInput } from "./types";

export const signInSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type SignInFormValues = z.infer<typeof signInSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().trim().min(1, "Gym name is required"),
  organizationSlug: z
    .string()
    .trim()
    .min(1, "Gym URL is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export function toRegisterInput(values: RegisterFormValues): RegisterInput {
  return {
    user: { name: values.name, email: values.email, password: values.password },
    organization: { name: values.organizationName, slug: values.organizationSlug },
  };
}