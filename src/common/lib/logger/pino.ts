import pino from "pino";

/**
 * The logger object for logging messages.
 * It sets the log level based on the LOG_LEVEL environment variable.
 * If the environment is in development mode, it uses the pino-pretty transport for easier debugging.
 *
 * @type {Object}
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    service: "educhronia-api",
  },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});
