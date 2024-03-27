import { getDatabaseAdapter } from "../database/knex-config";
import { BaseSchema } from "./base.schema";

export interface Activity extends BaseSchema {
    action: string;
    tableName: string;
    objectId: string;
    changes?: JSON;
    userId?: string;
    isSystem?: boolean;
    ip?: string;
    revision?: number;
}

export async function createActivityTable(): Promise<boolean> {
    
    return new Promise(async (resolve, reject) => {
        try {
            const activityExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_activity');
            if (activityExists) {
                resolve(false);
            } else {
                return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_activity', function (t) {
                    t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().fn.uuid());
                    t.string('action', 100).notNullable();
                    t.string('tableName', 100).notNullable();
                    t.string('objectId').notNullable();
                    t.json('changes').nullable();
                    t.string('userId').nullable();
                    t.boolean('isSystem').nullable();
                    t.string('ip').nullable();
                    t.timestamp('when', { useTz: true, defaultToNow: true });

                    t.foreign('userId').references('email').inTable('efficacy.efficacy_users').onUpdate('CASCADE').onDelete('CASCADE');
                    resolve(true);
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}