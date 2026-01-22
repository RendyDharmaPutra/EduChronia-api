import { env } from "./common/config/env";
import { createApp } from "./app";

/**
 * This is the entry point of the application.
 * It has an object with two properties:
 * - `port`: The port number on which the application should listen.
 * - `fetch`: The fetch function of the Hono application.
 */
export default {
  // The port number on which the application should listen.
  // It is obtained from the environment variable `PORT`.
  port: env.PORT,

  // The fetch function of the Hono application.
  // It is obtained by calling the `fetch` method of the Hono application instance.
  fetch: createApp().fetch,
};
