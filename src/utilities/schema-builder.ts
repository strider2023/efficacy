import { CreateCollection, CreateCollectionProperty, UpdateCollectionProperty } from "../interfaces";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";
import { PropertyTypes } from "../enums";
import { CollectionProperty } from "../schemas";
import * as _ from "lodash";

//https://devhints.io/knex
export class SchemaBuilder {

    public async syncTables() {
        const tables = await getDatabaseAdapter().select(['schemaname', 'tablename', 'tableowner', 'tablespace', 'hasindexes', 'hasrules', 'hastriggers', 'rowsecurity'])
            .from('pg_catalog.pg_tables').where((qb) => {
                qb.whereNot('schemaname', 'pg_catalog');
                qb.whereNot('schemaname', 'information_schema');
                qb.whereNot('schemaname', 'efficacy');
            })
        console.log(tables)
        for (const t of tables) {
            console.log(t.tablename)
            const columns = await getDatabaseAdapter().select([
                'column_name as propertyName',
                'ordinal_position as poistion',
                'column_default as default',
                'is_nullable as required',
                'data_type as dataType',
                'udt_schema as utdSchema',
                'udt_name as propertyType'])
                .from('information_schema.columns')
                .where('table_name', t.tablename);
            console.log(columns);
        }
    }

    /**
     * 
     * @param request 
     */
    public async createTable(request: CreateCollection) {
        try {
            await getDatabaseAdapter().schema.withSchema(request.schemaName || 'public')
                .createTable(request.tableName, function (t) {
                    t.uuid("id", { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
                    if (request.useTimestamps) {
                        t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });
                    }
                });
        } catch (e) {
            throw new ApiError("Create Collection Error", 500, e.message);
        }
    }

    /**
     * 
     * @param schemaName 
     * @param tableName 
     */
    public async removeTable(schemaName: string, tableName: string) {
        try {
            await getDatabaseAdapter().schema.withSchema(schemaName)
                .dropTableIfExists(tableName);
        } catch (e) {
            throw new ApiError("Create Collection Error", 500, e.message);
        }
    }

    public async addTableProperty(
        schemaName: string,
        tableName: string,
        props: CreateCollectionProperty) {
        try {
            const exists = await getDatabaseAdapter().schema.withSchema(schemaName).hasTable(tableName);
            if (exists) {
                const t = await getDatabaseAdapter().schema.withSchema(schemaName).table(tableName, (t) => {
                    this.addTableColumn(t, props);
                    // console.log(t, exists);
                });
            } else {
                throw new ApiError("Create Collection Property Error", 500, `Table ${tableName} does not exists.`);
            }
        } catch (e) {
            throw new ApiError("Create Collection Property Error", 500, e.message);
        }
    }

    public async updateTableProperty(
        schemaName: string,
        tableName: string,
        original: CollectionProperty) {
        try {
            getDatabaseAdapter().schema.withSchema(schemaName).hasTable(tableName).then((exists) => {
                if (exists) {
                    getDatabaseAdapter().schema.withSchema(schemaName).alterTable(tableName, (t) => {
                        this.addTableColumn(t, original).alter();
                    });
                } else {
                    throw new ApiError("Create Collection Property Error", 500, `Table ${tableName} does not exists.`);
                }
            });
        } catch (e) {
            throw new ApiError("Create Collection Property Error", 500, e.message);
        }
    }

    public async removeTableProperty(schemaName: string, tableName: string, propertyName: string) {
        try {
            const exists = await getDatabaseAdapter().schema.withSchema(schemaName).hasTable(tableName);
            if (exists) {
                getDatabaseAdapter().schema.withSchema(schemaName).table(tableName, (t) => {
                    t.dropColumn(propertyName)
                });
            } else {
                throw new ApiError("Create Collection Property Error", 500, `Table ${tableName} does not exists.`);
            }
        } catch (e) {
            throw new ApiError("Create Collection Property Error", 500, e.message);
        }
    }

    private addTableColumn(t: any, property: CreateCollectionProperty | CollectionProperty): any {
        let tableProp = this.createColumn({
            table : t, 
            type: property.type,
            propertyName: property.propertyName,
            enumValues: property.enumValues,
            maximum: property.maximum,
            numericPrecision: property.numericPrecision,
            numericScale: property.numericScale,
            foreignKeyColumn: property.foreignKeyColumn,
            foreignKeySchema: property.foreignKeySchema,
            foreignKeyTable: property.foreignKeyTable
        })
        property.nullable ? tableProp.notNullable() : tableProp.nullable();
        if (property.isUnique) {
            tableProp.unique();
        }
        if (property.regex) {
            tableProp.checkRegex(property.regex);
        }
        if (property.stringOneOf) {
            tableProp.checkIn(property.stringOneOf);
        }
        if (property.stringNoneOf) {
            tableProp.checkNotIn(property.stringNoneOf);
        }
        if (property.stringLengthCheckOperator && property.stringLengthCheck && property.maximum) {
            tableProp.checkLength(property.stringLengthCheckOperator, property.maximum);
        }
        if (property.setNumberPositive && property.setNumberNegative) {
            tableProp.checkPositive();
        }
        if (property.setNumberNegative) {
            tableProp.checkNegative();
        }
        if (property.checkNumberRange && property.minimum && property.maximum) {
            tableProp.checkBetween([property.minimum, property.maximum]);
        }
        return tableProp;
    }

    private createColumn(prop: CreateTable): any {
        switch (prop.type) {
            case PropertyTypes.STRING:
                return prop.table.string(prop.propertyName, prop.maximum || 255);
            case PropertyTypes.TEXT:
                return prop.table.string(prop.propertyName, prop.maximum || 255);
            case PropertyTypes.BOOLEAN:
                return prop.table.boolean(prop.propertyName);
            case PropertyTypes.INTEGER:
                return prop.table.integer(prop.propertyName);
            case PropertyTypes.BIG_INTEGER:
                return prop.table.bigInteger(prop.propertyName);
            case PropertyTypes.FLOAT:
                return prop.table.float(prop.propertyName, prop.numericPrecision || 8, prop.numericScale || 2);
            case PropertyTypes.DECIMAL:
                return prop.table.decimal(prop.propertyName, prop.numericPrecision || 8, prop.numericScale || 2);
            case PropertyTypes.TIMESTAMP:
                return prop.table.timestamp(prop.propertyName);
            case PropertyTypes.DATE_TIME:
                return prop.table.dateTime(prop.propertyName);
            case PropertyTypes.DATE:
                return prop.table.date(prop.propertyName);
            case PropertyTypes.TIME:
                return prop.table.time(prop.propertyName);
            case PropertyTypes.JSON:
                return prop.table.json(prop.propertyName);
            case PropertyTypes.OBJECT:
                return prop.table.uuid(prop.propertyName)
                    .foreign(prop.propertyName)
                    .references(prop.foreignKeyColumn)
                    .inTable(`${prop.foreignKeySchema}.${prop.foreignKeyTable}`);
            case PropertyTypes.ARRAY:
                return prop.table.uuid(prop.propertyName)
                    .foreign(prop.propertyName)
                    .references(prop.foreignKeyColumn)
                    .inTable(`${prop.foreignKeySchema}.${prop.foreignKeyTable}`);
            case PropertyTypes.ASSETS:
                return prop.table.string(prop.propertyName);
            case PropertyTypes.STRING_ENUM:
                return prop.table.enu(prop.propertyName, prop.enumValues);
            case PropertyTypes.HASH:
                return prop.table.string(prop.propertyName);
        }
    }
}

interface CreateTable {
    table: any,
    type: string,
    propertyName: string,
    enumValues?: string[],
    maximum?: number,
    numericPrecision?: number,
    numericScale?: number
    foreignKeyColumn?: string,
    foreignKeySchema?: string,
    foreignKeyTable?: string
}