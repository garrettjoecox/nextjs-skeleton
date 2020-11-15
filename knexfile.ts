import chalk from 'chalk';
import { pick } from 'lodash';
import { resolve } from 'path';
import { appConfig, databaseConfig } from './backend/config';
import { Logger } from './backend/utils/logger';

const { pool, ...connection } = databaseConfig;
const logger = new Logger(chalk.cyan('Database'));

const knexConfig = {
  client: 'mysql2',
  connection,
  pool,
  migrations: {
    tableName: 'knex_migrations',
    directory: resolve(__dirname, 'backend/database/migrations'),
  },
  seeds: {
    directory: resolve(__dirname, 'backend/database/seeds'),
  },
  log: {
    warn: (message: any) => logger.info(pick(message, ['method', 'bindings', 'sql'])),
    error: (message: any) => logger.error(pick(message, ['method', 'bindings', 'sql'])),
    deprecate: (message: any) => logger.verbose(pick(message, ['method', 'bindings', 'sql'])),
    debug: (message: any) => logger.verbose(pick(message, ['method', 'bindings', 'sql'])),
  },
  debug: appConfig.env === 'development',
};

export default knexConfig;
