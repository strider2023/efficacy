import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
import { 
    Collection,
    MetadataProperty,
    AppBaseEntity,
    MetadataViewProperty,
    ArrayViewProperty
} from "./entities";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST || "localhost",
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME || "test",
    password: DB_PASSWORD || "test",
    database: DB_DATABASE || "efficacy",
    synchronize: NODE_ENV === "dev" ? true : false,
    logging: NODE_ENV === "dev" ? false : false,
    entities: [
        AppBaseEntity,
        Collection,
        MetadataProperty,
        MetadataViewProperty,
        ArrayViewProperty
    ],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [],
})
