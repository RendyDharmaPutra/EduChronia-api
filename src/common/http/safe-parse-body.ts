import { Context } from "hono";
import z from "zod";
import { ValidationException } from "./exception/validation.exception";
import { logger } from "../lib/logger/pino";

export const safeParseBody = async <T>(
  c: Context,
  dto: z.ZodType<T>,
  errorName: string,
) => {
  // 1. Validate Input based on DTO
  const rawBody = await c.req.json();
  // logger.debug({ rawBody }, "Raw body");
  const parsedBody = dto.safeParse(rawBody);
  logger.debug({ parsedBody }, "Parsed body");
  // 2. Handle validation result:
  //    - Throw error for failed
  if (!parsedBody.success)
    throw new ValidationException(
      errorName,
      parsedBody.error.flatten().fieldErrors,
    );

  return parsedBody.data;
};
