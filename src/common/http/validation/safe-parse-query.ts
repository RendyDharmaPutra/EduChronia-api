import { Context } from "hono";
import z from "zod";
import { ValidationException } from "../exception/validation.exception";
import { logger } from "../../lib/logger/pino";
import { PaginationQuery, paginationQuerySchema } from "./pagination.query";

/**
 * Safely parses request query parameters using a Zod schema.
 *
 * @param c - The Hono context object.
 * @param schema - The Zod schema to validate the query against.
 * @param message - Custom error message to be used in the ValidationException.
 * @returns The successfully parsed and typed query data.
 * @throws {ValidationException} If the query parameters fail schema validation.
 */
export const safeParseQuery = <T>(
  c: Context,
  schema: z.ZodType<T>,
  message: string,
): T => {
  const rawQuery = c.req.query();

  const parsed = schema.safeParse(rawQuery);
  logger.debug({ parsed }, "Parsed query");

  if (!parsed.success)
    throw new ValidationException(message, parsed.error.flatten().fieldErrors);

  return parsed.data;
};

/**
 * Specifically parses and validates pagination-related query parameters.
 *
 * @param c - The Hono context object.
 * @returns The parsed pagination query data.
 */
export const safeParsePaginationQuery = (c: Context): PaginationQuery =>
  safeParseQuery(c, paginationQuerySchema, "Nilai pagination tidak valid");
