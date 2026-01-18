import { env } from "./common/config/env";
import { createApp } from "./app";

export default {
  port: env.PORT,
  fetch: createApp().fetch,
};
