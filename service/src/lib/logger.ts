import { env, isProduction } from "./env.js";
import pino from "pino";

export const logger = pino({
  level:
    env.NODE_ENV === "test"
      ? "silent"
      : isProduction
      ? "info"
      : "debug",

  ...(!isProduction && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
  redact: {
        paths: [
          "req.headers.authorization", 
          "req.headers.cookie", 
          "res.headers['set-cookie']",
          "*.password", 
          "*.apiKey", 
          "*.key",
          "*.secret",
          "*.token",
          "req.body.password",
          "req.body.*.password",
        ],
        censor: "[REDACTED]",
    },
});
