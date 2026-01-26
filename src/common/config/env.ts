/**
 * Retrieves the value of an environment variable.
 * If the variable is not defined, it throws an error.
 *
 * @param {string} key - The name of the environment variable.
 * @throws {Error} If the environment variable is not defined.
 * @returns {string} The value of the environment variable.
 */
const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not defined.`);

  return value;
};

/**
 * An object that contains the values of the environment variables used in the application.
 *
 * @property {string} PORT - The port number on which the application should listen.
 * @property {string} DATABASE_URL - The URL of the database.
 * @property {string} BETTER_AUTH_BASE_URL - The base URL of the Better Auth server.
 * @property {string} BETTER_AUTH_SECRET - The secret used by Better Auth.
 * @property {string} GOOGLE_CLIENT_ID - The client ID of the Google provider.
 * @property {string} GOOGLE_CLIENT_SECRET - The client secret of the Google provider.
 */
export const env = {
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  BETTER_AUTH_BASE_URL: getEnv("BETTER_AUTH_BASE_URL"),
  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
};
