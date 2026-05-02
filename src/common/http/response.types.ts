/**
 * Represents a standardized successful API response structure.
 * 
 * @template T - The type of the data payload returned.
 */
export type SuccessResponse<T> = {
  success: true;
  /** The payload data of the response */
  data?: T;
  /** Additional metadata, such as pagination details */
  meta?: unknown;
};

/**
 * Represents a standardized error API response structure.
 */
export type ErrorResponse = {
  success: false;
  /** Details regarding the error that occurred */
  error: {
    /** A machine-readable error type identifier */
    type: string;
    /** A human-readable error message */
    message: string;
    /** Optional additional details or validation errors */
    details?: unknown;
  };
};
