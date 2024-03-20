import { CreateCollection, CreateCollectionProperty } from "../interfaces";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";
import { PropertyTypes } from "../enums";

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

    public async addTableProperty(schemaName: string, tableName: string, props: CreateCollectionProperty) {
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

    public async updateTableProperty(schemaName: string, tableName: string, props: CreateCollectionProperty) {
        try {
            getDatabaseAdapter().schema.withSchema(schemaName).hasTable(tableName).then((exists) => {
                if (exists) {
                    getDatabaseAdapter().schema.withSchema(schemaName).table(tableName, (t) => {
                        this.addTableColumn(t, props);
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

    private addTableColumn(t: any, property: CreateCollectionProperty) {
        let tableProp;
        switch (property.type) {
            case PropertyTypes.STRING:
                tableProp = t.string(property.propertyName, property.maximum || 255);
                break;
            case PropertyTypes.TEXT:
                tableProp = t.string(property.propertyName, property.maximum || 255);
                break;
            case PropertyTypes.BOOLEAN:
                tableProp = t.boolean(property.propertyName);
                break;
            case PropertyTypes.INTEGER:
                tableProp = t.integer(property.propertyName);
                break;
            case PropertyTypes.BIG_INTEGER:
                tableProp = t.bigInteger(property.propertyName);
                break;
            case PropertyTypes.FLOAT:
                tableProp = t.float(property.propertyName, property.numericPrecision || 8, property.numericScale || 2);
                break;
            case PropertyTypes.DECIMAL:
                tableProp = t.decimal(property.propertyName, property.numericPrecision || 8, property.numericScale || 2);
                break;
            case PropertyTypes.TIMESTAMP:
                tableProp = t.timestamp(property.propertyName);
                break;
            case PropertyTypes.DATE_TIME:
                tableProp = t.dateTime(property.propertyName);
                break;
            case PropertyTypes.DATE:
                tableProp = t.date(property.propertyName);
                break;
            case PropertyTypes.TIME:
                tableProp = t.time(property.propertyName);
                break;
            case PropertyTypes.JSON:
                tableProp = t.json(property.propertyName);
                break;
            case PropertyTypes.OBJECT:
                tableProp = t
                    .uuid(property.propertyName)
                    .foreign(`${property.foreignKeyColumn}_id`)
                    .references("id")
                    .inTable(`${property.foreignKeySchema}.${property.foreignKeyTable}`);
                break;
            case PropertyTypes.ARRAY:
                tableProp = t
                    .uuid(property.propertyName)
                    .foreign(`${property.foreignKeyColumn}_id`)
                    .references("id")
                    .inTable(`${property.foreignKeySchema}.${property.foreignKeyTable}`);
                break;
            case PropertyTypes.ASSETS:
                tableProp = t.string(property.propertyName);
                break;
            case PropertyTypes.STRING_ENUM:
                tableProp = t.enu(property.propertyName, property.enumValues);
                break;
            case PropertyTypes.HASH:
                tableProp = t.string(property.propertyName);
                break;
        }
        property.isRequired ? tableProp.notNullable() : tableProp.nullable();
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
    }
}