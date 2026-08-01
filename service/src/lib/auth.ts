import { betterAuth } from "better-auth";
import { apiKey } from "@better-auth/api-key";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { env, isProduction } from "../lib/env.js";
import { prisma } from "./prisma.js";
import { logger } from "./logger.js";
import { SystemRole } from "../generated/prisma/client.js";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: [SystemRole.SUPER_ADMIN, SystemRole.SUPPORT],
                input: false,
                required: false,
            },
        },
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: { enabled: true, maxAge: 300 }
    },

    rateLimit: {
        enabled: true,
        window: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX,
    },

    advanced: {
        useSecureCookies: isProduction,
        defaultCookieAttributes: {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        },
        database: {
            generateId: "uuid",
        },
    },

    trustedOrigins: [env.DASHBOARD_ORIGIN],
    plugins: [
        apiKey({
            schema: {
                apikey: {
                    modelName: "apiKey",
                },
            },
            rateLimit: {
                enabled: true,
                timeWindow: 1000*60*60,
                maxRequests: 120,
            }
        })
    ],

    logger: {
        disabled: false,
        level: "debug",
        log: (level, message, ...args) => {
            logger[level]({ args }, message);
            }
    },
});