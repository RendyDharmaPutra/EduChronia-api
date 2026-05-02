import type { Context, Next } from "hono";
import { auth } from "../../lib/auth";
import { UnauthorizedException } from "../exception/unauthorized.exception";
import { createMiddleware } from "hono/factory";
import { logger } from "../../lib/logger/pino";

/**
 * Middleware to protect routes that require authentication.
 * 
 * This middleware checks for a valid session using the request headers.
 * If a valid session is found, it extracts the user ID and attaches it 
 * to the request context variables for downstream use.
 * 
 * @throws {UnauthorizedException} If no valid session is found.
 */
export const requireAuth = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c: Context, next: Next) => {
  logger.debug({ headers: c.req.raw.headers }, "Headers");

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedException("Tidak terautentikasi");
  }

  c.set("userId", session.user.id);

  await next();
});
