export type SuccessResponse<T> = {
  success: true;
  data?: T;
  meta?: unknown;
};

export type ErrorResponse = {
  success: false;
  error: {
    type: string;
    message: string;
    details?: unknown;
  };
};
