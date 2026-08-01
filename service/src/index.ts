import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { toNodeHandler } from "better-auth/node";
import { logger } from "./lib/logger.js";
import { env, isProduction } from "./lib/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { pinoHttp } from "pino-http";
import { prisma } from "./lib/prisma.js";
import { promisify } from "node:util";
import { auth } from "./lib/auth.js";

import adminRouter from "./modules/admin/router.js";
import publicRouter from "./modules/public/routes.js";
import leadRouter from "./modules/leads/router.js";
import authRouter from "./modules/registration/routes.js";
import apiRouter from "./modules/api/router.js";
import analyticsRouter from "./modules/analytics/router.js";
import { tasksRouter } from "./modules/notes/router.js";

const app = express();

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(pinoHttp({ 
  logger,
  customSuccessMessage(req, res) {
    return `${req.method} ${req.originalUrl} -> ${res.statusCode}`;
  },

  serializers: {
    req() {
      return undefined;
    },
    res() {
      return undefined;
    },
  }, 
}));

app.use(
  "/api/public",
  cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);


app.use(
  cors({
    origin: env.DASHBOARD_ORIGIN,
    credentials: true,
  })
);


app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok', timestamp: new Date() });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

app.use("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests",
    },
});
app.use(limiter);

app.use("/api/admin", adminRouter);
app.use("/api/leads", leadRouter);
app.use("/api/register", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/public", publicRouter);
app.use("/api/api-keys", apiRouter);
app.use("/api/tasks", tasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});

const closeServer = promisify(server.close.bind(server));

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info({ signal }, "Shutdown started");

  try {
    await closeServer();
    logger.info("HTTP server closed");

    await prisma.$disconnect();
    logger.info("Database disconnected");

    logger.info("Shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Shutdown failed");
    process.exit(1);
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));


process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception");
  void shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "Unhandled promise rejection");
  void shutdown("unhandledRejection");
});