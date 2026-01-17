import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
