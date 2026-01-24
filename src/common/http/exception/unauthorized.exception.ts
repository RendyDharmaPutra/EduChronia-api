import { AppException } from "./base.exception";

/**
 * @class UnauthorizedException
 * @extends AppException
 * Class representing an unauthorized exception.
 *
 * This class extends the `AppException` class and represents an exception that occurs when the user is not authorized to access a resource.
 * It adds a `message` parameter to the constructor.
 *
 * @property {string} message - The error message.
 * @property {string} type - The type of the exception.
 * @property {ContentfulStatusCode} statusCode - The HTTP status code associated with the exception.
 */
export class UnauthorizedException extends AppException {
  /**
   * Creates an instance of UnauthorizedException.
   *
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message, "UNAUTHORIZED", 401);
  }
}
