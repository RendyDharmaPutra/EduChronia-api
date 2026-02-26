import { Context } from "hono";
import z from "zod";
import { ValidationException } from "../exception/validation.exception";
import { logger } from "../../lib/logger/pino";

/**
 * Safely parses and validates the request body against a Zod schema.
 *
 * @template T - The expected type of the parsed body.
 * @param c - The Hono context object.
 * @param schema - The Zod schema to validate the request body.
 * @param message - A custom error message to be used in the ValidationException.
 * @returns The validated and typed request body.
 * @throws {ValidationException} If the request body fails validation.
 */
export const safeParseBody = async <T>(
  c: Context,
  schema: z.ZodType<T>,
  message: string,
): Promise<T> => {
  const rawBody = await c.req.json();

  const parsedBody = schema.safeParse(rawBody);
  logger.debug({ parsedBody }, "Parsed body");

  if (!parsedBody.success)
    throw new ValidationException(
      message,
      parsedBody.error.flatten().fieldErrors,
    );

  return parsedBody.data;
};
