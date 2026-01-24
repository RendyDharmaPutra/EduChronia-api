import { Context } from "hono";
import { logger } from "../lib/logger/pino";
import { AppException } from "./exception/base.exception";
import { ValidationException } from "./exception/validation.exception";
import { response } from "./response";

/**
 * Middleware for handling errors in the application.
 *
 * This middleware logs the error and returns a JSON response
 * with an error object containing the type and a generic error message.
 *
 * @param {Error} err - The error that occurred.
 * @param {Context} c - The current request context.
 */
export const errorHandler = async (err: Error, c: Context) => {
  logger.error(
    `${err.message} (${c.req.method} ${c.req.path} ${c.res.status})`,
  );

  if (err instanceof ValidationException)
    return response.fail(
      c,
      {
        type: err.type,
        message: err.message,
        details: err.details,
      },
      err.statusCode,
    );

  if (err instanceof AppException)
    return response.fail(
      c,
      {
        type: err.type,
        message: err.message,
      },
      err.statusCode,
    );

  return response.fail(
    c,
    {
      type: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan tidak diketahui",
    },
    500,
  );
};
