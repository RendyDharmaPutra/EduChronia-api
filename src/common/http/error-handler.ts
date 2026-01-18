import { Context } from "hono";
import { AppException } from "./exception/base.exception";
import { ValidationException } from "./exception/validation.exception";
import { response } from "./response";

export const errorHandler = async (err: Error, c: Context) => {
  if (err instanceof ValidationException)
    return response.fail(
      c,
      {
        type: err.type,
        message: err.message,
        details: err.details,
      },
      err.statusCode,
    );

  if (err instanceof AppException)
    return response.fail(
      c,
      {
        type: err.type,
        message: err.message,
      },
      err.statusCode,
    );

  return response.fail(
    c,
    {
      type: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan tidak diketahui",
    },
    500,
  );
};
