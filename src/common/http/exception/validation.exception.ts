import { AppException } from "./base.exception";

/**
 * Creates an instance of ValidationException.
 *
 * @param {string} message - The error message.
 * @param {unknown} [details] - Additional details about the validation error.
 */
export class ValidationException<T> extends AppException {
  constructor(
    message: string,
    public readonly details?: T,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}
