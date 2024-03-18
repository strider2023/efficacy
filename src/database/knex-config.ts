import * as dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const { DB_CLIENT, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SSL } =
  process.env;

export const getDatabaseAdapter = () => {
  if(DB_CLIENT == 'sqlite3' || DB_CLIENT == 'better-sqlite3') {
    return require('knex')({
      client: 'sqlite3', // or 'better-sqlite3'
      connection: {
        filename: './mydb.sqlite',
      },
    });
  } else {
    return knex({
      client: DB_CLIENT || 'pg',
      connection: {
        host: DB_HOST || "localhost",
        port: parseInt(DB_PORT || "5432"),
        user: DB_USERNAME || "test",
        password: DB_PASSWORD || "test",
        database: DB_DATABASE || "efficacy",
        ssl: DB_SSL ? { rejectUnauthorized: false } : false,
      },
      migrations: {
        directory: './migrations.ts'
      },
      seeds: {
        directory: './seeds.ts'
      },
    });
  } 
}