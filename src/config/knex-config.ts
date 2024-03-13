import * as dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

export const knexConfig = knex({
  client: 'pg',
  connection: {
    host: DB_HOST || "localhost",
    port: parseInt(DB_PORT || "5432"),
    user: DB_USERNAME || "test",
    password: DB_PASSWORD || "test",
    database: DB_DATABASE || "efficacy",
  }
});