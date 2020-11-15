import { loadEnvConfig } from '@next/env';
import { resolve } from 'path';

loadEnvConfig(resolve(__dirname, '..'), process.env.NODE_ENV !== 'production');

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

export const databaseConfig = {
  database: envString('RDS_DATABASE', 'unify_poc_02'),
  host: envString('RDS_HOST', '127.0.0.1'),
  password: envString('RDS_PASSWORD', 'tailwind'),
  port: envNumber('RDS_PORT', 3306),
  user: envString('RDS_USERNAME', 'root'),
  pool: {
    min: envNumber('RDS_POOL_MIN', 2),
    max: envNumber('RDS_POOL_MAX', 10),
  },
};

export const appConfig = {
  env: envString('NODE_ENV', 'development'),
  baseUrl: envString('BASE_URL', 'http://localhost'),
  cookieSigningKey: envString('COOKIE_SIGNING_KEY', 'Configure Locally'),
  jwtSecret: envString('JWT_SECRET', 'Configure Locally'),
  jwtExpiration: envNumber('JWT_EXPIRATION', 1000 * 60 * 5), // 5 minutes
  exposeErrors: envBoolean('EXPOSE_ERRORS', false),
};

export const logConfig: { [category: string]: string } = {
  default: envString('LOG_LEVEL', 'info'),
  Database: envString('DB_LOG_LEVEL', 'silent'),
};
