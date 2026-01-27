import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { openAPI } from "better-auth/plugins";
import { env } from "../config/env";
import * as schema from "../db/schema/auth.schema";

/**
 * The Better Auth configuration for the application.
 * It sets up the authentication functionality using Better Auth library.
 *
 * @property {string} baseURL - The base URL of the Better Auth server.
 * @property {object} emailAndPassword - The configuration for email and password authentication.
 * @property {boolean} emailAndPassword.enabled - Whether email and password authentication is enabled.
 * @property {array} trustedOrigins - The list of trusted origins for the application.
 * @property {object} socialProviders - The configuration for social providers.
 * @property {object} socialProviders.google - The configuration for Google as a social provider.
 * @property {string} socialProviders.google.accessType - The access type for Google OAuth.
 * @property {string} socialProviders.google.prompt - The prompt for Google OAuth.
 * @property {string} socialProviders.google.clientId - The client ID for Google OAuth.
 * @property {string} socialProviders.google.clientSecret - The client secret for Google OAuth.
 * @property {object} database - The configuration for the database adapter.
 * @property {string} database.provider - The provider for the database adapter.
 * @property {object} database.schema - The schema for the database adapter.
 * @property {array} plugins - The list of plugins for the Better Auth instance.
 */
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_BASE_URL,

  emailAndPassword: {
    enabled: false,
  },
  trustedOrigins: [env.HOST_WEB_BASE_URL, env.HOST_API_BASE_URL],
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [openAPI()],
});
