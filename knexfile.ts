import { resolve } from 'path';
import { appConfig, databaseConfig } from './src/config';

const { pool, ...connection } = databaseConfig;

const knexConfig = {
  client: 'mysql2',
  connection,
  pool,
  migrations: {
    tableName: 'knex_migrations',
    directory: resolve(__dirname, 'src/database/migrations'),
  },
  seeds: {
    directory: resolve(__dirname, 'src/database/seeds'),
  },
  debug: appConfig.env === 'development',
};

export default knexConfig;
