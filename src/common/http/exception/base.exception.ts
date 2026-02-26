import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Base class for application-specific exceptions.
 * Extends the native Error class to include HTTP status codes and error types for structured error handling.
 */
export class AppException extends Error {
  /**
   * A machine-readable string identifying the specific type of error.
   */
  public readonly type: string;

  /**
   * The HTTP status code associated with this exception.
   */
  public readonly statusCode: ContentfulStatusCode;

  /**
   * @param message - A human-readable description of the error.
   * @param type - A unique identifier for the error category.
   * @param statusCode - The HTTP status code to be returned in the response.
   */
  constructor(message: string, type: string, statusCode: ContentfulStatusCode) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}
