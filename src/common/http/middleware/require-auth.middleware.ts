import type { Context, Next } from "hono";
import { auth } from "../../lib/auth";
import { UnauthorizedException } from "../exception/unauthorized.exception";
import { createMiddleware } from "hono/factory";

export const requireAuth = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedException("Tidak terautentikasi");
  }

  c.set("userId", session.user.id);

  await next();
});
