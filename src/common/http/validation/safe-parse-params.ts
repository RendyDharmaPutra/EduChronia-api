import { Context } from "hono";
import z from "zod";
import { ValidationException } from "../exception/validation.exception";
import { logger } from "../../lib/logger/pino";

/**
 * Safely parses and validates request parameters using a Zod schema.
 *
 * @param c - The Hono context object.
 * @param schema - The Zod schema to validate the parameters against.
 * @param message - The error message to be used if validation fails.
 * @returns The validated and parsed parameters.
 * @throws {ValidationException} If the parameters do not match the schema.
 */
export const safeParseParams = <T>(
  c: Context,
  schema: z.ZodType<T>,
  message: string,
): T => {
  const rawParams = c.req.param();

  const parsed = schema.safeParse(rawParams);
  logger.debug({ parsed }, "Parsed params");

  if (!parsed.success)
    throw new ValidationException(message, parsed.error.flatten().fieldErrors);

  return parsed.data;
};
