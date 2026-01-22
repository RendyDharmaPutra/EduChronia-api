import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * The database connection pool.
 * It creates a connection pool using the `pg` library and initializes the `db` object with the drizzle ORM.
 *
 * @type {Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

/**
 * The drizzle ORM object for interacting with the database.
 */
export const db = drizzle(pool, {
  // Enable logging of SQL queries if the environment is in development mode.
  logger: process.env.NODE_ENV === "development",
});
