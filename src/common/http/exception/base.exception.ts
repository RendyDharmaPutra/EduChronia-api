import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Class representing an application exception.
 *
 * This class is used to represent exceptions that occur during the execution of the application.
 * It extends the built-in `Error` class and adds additional properties to provide more information about the exception.
 */
export class AppException extends Error {
  /**
   * The type of the exception.
   *
   * This property represents the type of the exception and is used to categorize and handle different types of exceptions.
   */
  public readonly type: string;

  /**
   * The HTTP status code associated with the exception.
   *
   * This property represents the HTTP status code that should be returned in the response to indicate the type of the exception.
   */
  public readonly statusCode: ContentfulStatusCode;

  /**
   * Creates an instance of AppException.
   *
   * @param {string} message - The error message.
   * @param {string} type - The type of the exception.
   * @param {ContentfulStatusCode} statusCode - The HTTP status code associated with the exception.
   */
  constructor(message: string, type: string, statusCode: ContentfulStatusCode) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}
