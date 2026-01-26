import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { openAPI } from "better-auth/plugins";
import { env } from "../config/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: false,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [openAPI()],
});
