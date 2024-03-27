import { SYSTEM_TABLE_STATUS } from "../constants/tables.constants";
import { getDatabaseAdapter } from "../database/knex-config";
import { BaseSchema } from "./base.schema";

export interface Assets extends BaseSchema {
    assetId: string;
    filename: string;
    mimetype: string;
    destination: string;
    path: string;
    description?: string;
    tags?: string[];
    filesize: number;
    additionalMetadata?: Record<string, any>
}

export async function createAssetsTable(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const assetsExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_assets');
            if (assetsExists) {
                resolve(false);
            } else {
                return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_assets', function (t) {
                    t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().fn.uuid());
                    t.string('assetId', 100).unique().notNullable();
                    t.string('filename', 100).notNullable();
                    t.string('mimetype', 100).notNullable();
                    t.string('destination', 20).notNullable();
                    t.string('path').notNullable();
                    t.integer('filesize').notNullable();
                    t.string('description').nullable();
                    t.specificType('tags', 'text ARRAY').nullable();
                    t.json('additionalMetadata').nullable();
                    t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
                    t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });
                    resolve(true);
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}