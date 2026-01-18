import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const response = {
  success<T>(
    c: Context,
    data?: T,
    meta?: unknown,
    status: ContentfulStatusCode = 200,
  ) {
    return c.json(
      {
        success: true,
        data,
        meta,
      },
      status,
    );
  },

  fail(
    c: Context,
    error: {
      type: string;
      message: string;
      details?: unknown;
    },
    status: ContentfulStatusCode = 500,
  ) {
    return c.json(
      {
        success: false,
        error,
      },
      status,
    );
  },
};
