import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppException extends Error {
  constructor(
    message: string,
    public readonly type: string,
    public readonly statusCode: ContentfulStatusCode,
  ) {
    super(message);
    this.type = type;
  }
}
