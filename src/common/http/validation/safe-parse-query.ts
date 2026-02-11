import { Context } from "hono";
import z from "zod";
import { ValidationException } from "../exception/validation.exception";
import { logger } from "../../lib/logger/pino";
import { paginationQuerySchema } from "./pagination.query";

export const safeParseQuery = <T>(
  c: Context,
  schema: z.ZodType<T>,
  message: string,
) => {
  const rawQuery = c.req.query();

  const parsed = schema.safeParse(rawQuery);
  // ? Debug query params value
  logger.debug({ parsed }, "Parsed query");

  if (!parsed.success)
    throw new ValidationException(message, parsed.error.flatten().fieldErrors);

  return parsed.data;
};

export const safeParsePaginationQuery = (c: Context) => {
  return safeParseQuery(
    c,
    paginationQuerySchema,
    "Nilai pagination tidak valid",
  );
};
