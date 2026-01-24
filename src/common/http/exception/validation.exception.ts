import { AppException } from "./base.exception";

/**
 * Creates an instance of ValidationException.
 *
 * @param {string} message - The error message.
 * @param {unknown} [details] - Additional details about the validation error.
 */
export class ValidationException extends AppException {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}
