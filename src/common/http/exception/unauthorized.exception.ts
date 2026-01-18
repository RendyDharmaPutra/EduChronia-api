import { AppException } from "./base.exception";

export class UnauthorizedException extends AppException {
  constructor(message: string) {
    super(message, "UNAUTHORIZED", 401);
  }
}
