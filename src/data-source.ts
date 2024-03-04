import "reflect-metadata"
import { DataSource } from "typeorm"

import * as dotenv from "dotenv";

import { Collection } from "./collections/entities/collection.entity";
import { CollectionMetadataProperty } from "./collections/entities/collection-metadata-property.entity";
import { Application } from "./application/application.entity";
import { AppBaseEntity } from "./common/base.entity";
import { ApplicationAsset } from "./assests-manager/assets-manager.entity";

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
        Application,
        ApplicationAsset,
        Collection,
        CollectionMetadataProperty
    ],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [],
})
