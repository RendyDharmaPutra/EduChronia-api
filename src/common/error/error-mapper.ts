import { AppException } from "../http/exception/base.exception";

export function mapToAppException(error: any): never {
  if (error instanceof AppException) throw error;

  throw new Error(error.message);
}
