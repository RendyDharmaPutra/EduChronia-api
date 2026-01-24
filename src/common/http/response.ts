import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Object containing methods for handling HTTP responses:
 * - `success`: returns a JSON response with a success status and an optional data and meta object.
 * - `fail`: returns a JSON response with an error object and an optional error details.
 */
export const response = {
  /**
   * Returns a JSON response with a success status and an optional data and meta object.
   *
   * @param {Context} c - The current request context.
   * @param {T} [data] - The data to be included in the response.
   * @param {unknown} [meta] - Additional metadata to be included in the response.
   * @param {ContentfulStatusCode} [status=200] - The HTTP status code for the response.
   */
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

  /**
   * Returns a JSON response with an error object and an optional error details.
   *
   * @param {Context} c - The current request context.
   * @param {Object} error - The error object containing a type and message.
   * @param {string} error.type - The type of the error.
   * @param {string} error.message - The error message.
   * @param {unknown} [error.details] - Additional details about the error.
   * @param {ContentfulStatusCode} [status=500] - The HTTP status code for the response.
   */
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
