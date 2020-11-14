/**
 * Returns the string value of an environment variable, or a default value
 * if the variable is undefined.
 *
 * @param name environment variable to fetch
 * @param fallback default value when variable isn't defined
 * @returns value of the named environment variable
 */
export function envString(name: string, fallback: string): string {
  const it = process.env[name];
  if (typeof it === 'string' && it.length > 0) {
    return it;
  }

  return fallback;
}

/**
 * Returns the number value of an environment variable, or a default value
 * if the variable is undefined.
 *
 * @param name environment variable to fetch
 * @param fallback default value when variable isn't defined
 * @returns value of the named environment variable parsed as a number
 */
export function envNumber(name: string, fallback: number): number {
  const it = process.env[name];
  if (typeof it === 'string' && !isNaN(parseInt(it, 10))) {
    return parseInt(it, 10);
  }
  return fallback;
}

/**
 * Returns the boolean value of an environment variable, or a default value
 * if the variable is undefined.
 *
 * @param name environment variable to fetch
 * @param fallback default value when variable isn't defined
 * @returns value of the named environment variable parsed as a boolean
 */
export function envBoolean(name: string, fallback: boolean): boolean {
  const it = process.env[name];
  if (typeof it === 'string' && (it === 'TRUE' || it === 'true')) {
    return true;
  }

  return fallback;
}

/**
 * Database configuration is resolved from environment variables, falling back
 * to a default when an environment variable isn't set.
 */
export const databaseConfig = {
  database: envString('RDS_DATABASE', 'unify_poc_01'),
  host: envString('RDS_HOST', '127.0.0.1'),
  password: envString('RDS_PASSWORD', 'tailwind'),
  poolMin: envNumber('RDS_POOL_MIN', 2),
  poolMax: envNumber('RDS_POOL_MAX', 10),
  port: envNumber('RDS_PORT', 3306),
  user: envString('RDS_USERNAME', 'root'),
};

export const appConfig = {
  baseUrl: envString('BASE_URL', 'http://localhost'),
  jwtSecret: envString('JWT_SECRET', 'Configure Locally'),
  jwtExpiration: envNumber('JWT_EXPIRATION', 1000 * 60 * 5), // 5 minutes
  exposeErrors: envBoolean('EXPOSE_ERRORS', false),
};
