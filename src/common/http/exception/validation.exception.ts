import { AppException } from "./base.exception";

export class ValidationException extends AppException {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}
