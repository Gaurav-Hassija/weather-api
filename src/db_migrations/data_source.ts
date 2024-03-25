import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/db_migrations/models/*.model.js'],
  migrations: ['dist/db_migrations/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
