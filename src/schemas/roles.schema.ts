import { SYSTEM_TABLE_STATUS } from "../constants/tables.constants"
import { getDatabaseAdapter } from "../database/knex-config"
import { BaseSchema } from "./base.schema"

export interface Roles extends BaseSchema {
    roleId: string
    displayName: string
    description?: string
    adminAccess?: boolean
    portalAccess?: boolean
    appAccess?: boolean
}

export async function createRolesTable(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const rolesExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_roles');
            if (rolesExists) {
                resolve(false);
            } else {
                return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_roles', function (t) {
                    t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().fn.uuid());
                    t.string('roleId', 100).unique().notNullable();
                    t.string('displayName', 100).notNullable();
                    t.string('description').nullable();
                    t.boolean('adminAccess').nullable().defaultTo(false);
                    t.boolean('portalAccess').nullable().defaultTo(false);
                    t.boolean('appAccess').nullable().defaultTo(false);
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