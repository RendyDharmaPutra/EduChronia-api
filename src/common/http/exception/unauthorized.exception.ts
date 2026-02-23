import { AppException } from "./base.exception";

/**
 * Exception thrown when the user is not authorized to access a resource.
 * Maps to HTTP 401 Unauthorized.
 */
export class UnauthorizedException extends AppException {
  /**
   * @param message - The error message describing the unauthorized access.
   */
  constructor(message: string) {
    super(message, "UNAUTHORIZED", 401);
  }
}
