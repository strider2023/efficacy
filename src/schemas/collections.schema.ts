import { SYSTEM_TABLE_STATUS } from "../constants/tables.constants";
import { getDatabaseAdapter } from "../database/knex-config";
import { BaseSchema } from "./base.schema";

export interface Collections extends BaseSchema {
    collectionId: string
    displayName: string
    description?: string
    schemaName: string
    tableName: string
    permissions?: string[]
    isPublic?: boolean
    useTimestamps?: boolean
    additionalMetadata?: Record<string, any>
}

export async function createCollectionsTable(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const collectionExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collections');
            if (collectionExists) {
                resolve(false);
            } else {
                return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collections', function (t) {
                    t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().fn.uuid());
                    t.string('collectionId', 100).unique().notNullable();
                    t.string('displayName', 100).notNullable();
                    t.string('description').nullable();
                    t.string('schemaName', 100).notNullable().defaultTo('public');
                    t.string('tableName', 100).unique().notNullable();
                    t.json('additionalMetadata').nullable();
                    t.boolean('isPublic').nullable().default(true);
                    t.boolean('useTimestamps').nullable().default(true);
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