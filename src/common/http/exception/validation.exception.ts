import { AppException } from "./base.exception";

/**
 * Exception thrown when validation of input data fails.
 *
 * @template T The shape of the validation error details.
 */
export class ValidationException<T> extends AppException {
  /**
   * @param message A descriptive error message.
   * @param details Additional context or specific field errors.
   */
  constructor(
    message: string,
    public readonly details?: T,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}
