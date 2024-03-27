import { SYSTEM_TABLE_STATUS } from "../constants/tables.constants"
import { getDatabaseAdapter } from "../database/knex-config"
import { BaseSchema } from "./base.schema"

export interface User extends BaseSchema {
    firstname: string
    middlename?: string
    lastname: string
    phone: string
    email: string
    password: string
    roleId: string
    dob?: Date
    image?: string
    location?: string
    description?: string
    tags?: string[]
    additionalMetadata?: Record<string, any>
}

export async function createUserTable(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const userExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_users');
            if (userExists) {
                resolve(false);
            } else {
                return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_users', function (t) {
                    t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().fn.uuid());
                    t.string('firstname', 100).notNullable();
                    t.string('middlename', 100).nullable();
                    t.string('lastname', 100).notNullable();
                    t.string('phone', 20).unique().nullable();
                    t.string('email', 100).unique().notNullable().checkRegex('^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
                    t.string('password').notNullable();
                    t.uuid('roleId').notNullable();
                    t.date('dob').nullable();
                    t.string('image').nullable();
                    t.string('location').nullable();
                    t.string('description').nullable();
                    t.specificType('tags', 'text ARRAY').nullable();
                    t.json('additionalMetadata').nullable();
                    t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
                    t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

                    t.foreign('roleId').references('id').inTable('efficacy.efficacy_roles').onUpdate('CASCADE').onDelete('CASCADE');
                    resolve(true);
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}