import "dotenv/config";
import { z } from "zod";
import pino from "pino";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
    BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),
    DASHBOARD_ORIGIN: z.url("DASHBOARD_ORIGIN must be a valid URL"),
    SUPER_ADMIN_EMAIL: z.email("SUPER_ADMIN_EMAIL must be a valid email"),
    SUPER_ADMIN_PASSWORD: z.string().min(8, "SUPER_ADMIN_PASSWORD must be at least 8 characters long"),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    ENCRYPTION_KEY: z.string().min(32, "ENCRYPTION_KEY must be at least 32 characters long"),
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
    RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL is required"),
})

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    const errorDetails = parsed.error.flatten().fieldErrors;

    const logger = pino();

    logger.fatal(
        { 
            code: "ENVIRONMENT_VALIDATION_ERROR", 
            details: errorDetails 
        },
        "Application failed to boot: Invalid or missing environment configuration"
    );

    process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";