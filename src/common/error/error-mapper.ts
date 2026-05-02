import { AppException } from "../http/exception/base.exception";

/**
 * Maps any given error to an AppException.
 * If the error is already an AppException, it is re-thrown.
 * Otherwise, a new Error is created with the original error's message and re-thrown.
 * This function is intended to be used to ensure all errors are converted to AppExceptions before being thrown.
 * @param error - The error to map.
 * @returns Never, as it always throws an exception.
 */
export function mapToAppException(error: any): never {
  if (error instanceof AppException) throw error;

  throw new Error(error.message);
}
