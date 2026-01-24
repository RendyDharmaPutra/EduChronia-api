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
 */
export const env = {
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DATABASE_URL"),
};
