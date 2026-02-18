import { Context } from "hono";
import * as z from "zod";
import { ValidationException } from "../exception/validation.exception";

export function safeParseParams<T>(
  c: Context,
  schema: z.ZodType<T>,
  message: string,
): T {
  const rawParams = c.req.param();

  const parsed = schema.safeParse(rawParams);

  if (!parsed.success) {
    throw new ValidationException(message, parsed.error.flatten().fieldErrors);
  }

  return parsed.data;
}
