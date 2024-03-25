import { BaseSchema } from "./base.schema";

export interface CollectionProperty extends BaseSchema {
    collectionId: string
    propertyName: string
    displayName: string
    description?: string
    type: string
    nullable: boolean
    isUnique?: boolean
    default?: string
    regex?: string
    stringOneOf?: string[];
    stringNoneOf?: string[];
    stringLengthCheckOperator?: string
    stringLengthCheck?: boolean
    setNumberPositive?: boolean
    setNumberNegative?: boolean
    minimum?: number
    maximum?: number
    checkNumberRange?: boolean
    numericPrecision?: number
    numericScale?: number
    enumValues?: string[]
    dateFormat?: string
    foreignKeyColumn?: string
    foreignKeySchema?: string
    foreignKeyTable?: string
    additionalMetadata?: Record<string, any>
}

export async function createTable() {
    const collectionPropertiesExists = await getDatabaseAdapter().schema.withSchema('efficacy').hasTable('efficacy_collection_properties');
    if (!collectionPropertiesExists) {
        return getDatabaseAdapter().schema.withSchema('efficacy').createTable('efficacy_collection_properties', function (t) {
            t.uuid('id', { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
            t.string('collectionId', 100).notNullable();
            t.string('propertyName', 100).notNullable();
            t.string('displayName', 100).notNullable();
            t.string('description').nullable();
            t.enu('type', SYSTEM_COLLECTION_TABLE_TYPES).notNullable().defaultTo('string');
            t.boolean('nullable').notNullable().defaultTo(true);
            t.boolean('isUnique').notNullable().defaultTo(true);
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
            t.json('additionalMetadata').nullable();
            t.enu('status', SYSTEM_TABLE_STATUS).defaultTo('active');
            t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });

            t.foreign('collectionId').references('collectionId').inTable('efficacy.efficacy_collections').onUpdate('CASCADE').onDelete('CASCADE');
        });
    }
}