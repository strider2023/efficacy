import { SYSTEM_COLLECTION_TABLE_TYPES, SYSTEM_TABLE_STATUS } from "../constants/tables.constants";
import { getDatabaseAdapter } from "./knex-config";

export async function migrate() {

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_activity').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_activity', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('action', 100).notNullable();
                t.string('tableName', 100).notNullable();
                t.uuid('objectId').notNullable();
                t.uuid('userId').nullable();
                t.boolean('isSystem').nullable();
                t.string('ip').nullable();
                t.integer('revision').nullable();
                t.timestamp('when', { useTz: true, defaultToNow: true });

                t.foreign('userId').references('id').inTable('efficacy.efficacy_users');
            });
        }
    });

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_roles').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_roles', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('roleId', 100).notNullable();
                t.string('displayName', 100).notNullable();
                t.string('description').nullable();
                t.boolean('adminAccess').nullable().defaultTo(false);
                t.boolean('portalAccess').nullable().defaultTo(false);
                t.boolean('appAccess').nullable().defaultTo(false);
                t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
                t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

                t.unique(['roleId']);
            });
        }
    });

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_users').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_users', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('firstname', 100).notNullable();
                t.string('middlename', 100).nullable();
                t.string('lastname', 100).notNullable();
                t.string('phone', 20).nullable();
                t.string('email', 100).notNullable().checkRegex('^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
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

                t.unique(['email', 'phone']);
                t.foreign('roleId').references('id').inTable('efficacy.efficacy_roles');
            });
        }
    });

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_assets').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_assets', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('assetId', 100).notNullable();
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

                t.unique(['assetId']);
            });
        }
    });

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collections').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collections', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('collectionId', 100).notNullable();
                t.string('displayName', 100).notNullable();
                t.string('description').nullable();
                t.string('schemaName', 100).notNullable().defaultTo('public');
                t.string('tableName', 100).notNullable();
                t.integer('version').notNullable();
                t.boolean('isLatest').notNullable().defaultTo(true);
                t.specificType('permissions', 'text ARRAY').nullable();
                t.json('additionalMetadata').nullable();
                t.boolean('useTimestamps').nullable().default(true);
                t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
                t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });
            });
        }
    });

    getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collection_properties').then((exists) => {
        if (!exists) {
            return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collection_properties', function (t) {
                t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                t.string('collectionId', 100).notNullable();
                t.string('propertyName', 100).notNullable();
                t.string('displayName', 100).notNullable();
                t.string('description').nullable();
                t.enu('type', SYSTEM_COLLECTION_TABLE_TYPES).notNullable().defaultTo('string');
                t.boolean('isRequired').notNullable().defaultTo(false);
                t.boolean('isUnique').notNullable().defaultTo(false);
                t.string('default').nullable();
                t.string('regex').nullable();
                t.specificType('stringOneOf', 'text ARRAY').nullable();
                t.specificType('stringNoneOf', 'text ARRAY').nullable();
                t.boolean('stringLengthCheckOperator', ['=', '!=', '<=', '>=', '<', '>']).nullable();
                t.boolean('stringLengthCheck').nullable();
                t.boolean('setNumberPositive').nullable();
                t.boolean('setNumberNegative').nullable();
                t.integer('minimum').nullable();
                t.integer('maximum').nullable();
                t.boolean('checkNumberRange').nullable();
                t.integer('numericPrecision').nullable();
                t.integer('numericScale').nullable();
                t.specificType('enumValues', 'text ARRAY').nullable();
                t.string('dateFormat').nullable();
                t.string('foreignKeyColumn').nullable();
                t.string('foreignKeySchema').nullable();
                t.string('foreignKeyTable').nullable();
                t.integer('version').notNullable();
                t.boolean('isLatest').notNullable().defaultTo(true);
                t.json('additionalMetadata').nullable();
                t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
                t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

                t.foreign('collectionId').references('collectionId').inTable('efficacy.efficacy_collections');
            });
        }
    });

    // getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collection_views').then((exists) => {
    //     if (!exists) {
    //         return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collection_views', function (t) {
    //             t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
    //             t.string('collectionId', 100).notNullable();
    //             t.string('viewName', 100).notNullable();
    //             t.string('displayName', 100).notNullable();
    //             t.string('description').nullable();
    //             t.enu('type', SYSTEM_COLLECTION_VIEW_TYPES).notNullable();
    //             t.integer('version').notNullable();
    //             t.boolean('isLatest').notNullable();
    //             t.json('additionalMetadata').nullable();
    //             t.enu('status', ['active', 'deleted', 'archived', 'inactive']);
    //             t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

    //             t.foreign('collectionId').references('collectionId').inTable('efficacy.efficacy_collections');
    //         });
    //     }
    // });
}