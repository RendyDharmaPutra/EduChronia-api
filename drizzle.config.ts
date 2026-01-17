import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/**/**.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Bun.env.DATABASE_URL ?? "",
  },
});
