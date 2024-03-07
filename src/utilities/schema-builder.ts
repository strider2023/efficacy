import { ICollection, ICollectionItemQuery } from "../interfaces";
import { PropertyTypes } from "../enums/enums";
import { knexConfig } from "../knex-config";
import { Collection } from "../entities";

//https://devhints.io/knex
export class SchemaBuilder {

    constructor() { }

    public async syncTables() {
        const tables = await knexConfig.select(['schemaname', 'tablename', 'tableowner', 'tablespace', 'hasindexes', 'hasrules', 'hastriggers', 'rowsecurity'])
            .from('pg_catalog.pg_tables').where((qb) => {
                qb.whereNot('schemaname', 'pg_catalog');
                qb.whereNot('schemaname', 'information_schema');
                qb.whereNot('schemaname', 'efficacy');
            })
        console.log(tables)
        for (const t of tables) {
            console.log(t.tablename)
            const columns = await knexConfig.select([
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

    public async createTable(request: ICollection): Promise<boolean> {
        await knexConfig.schema.dropTableIfExists(request.tableName);
        await knexConfig.schema.withSchema(request.schemaName || 'efficacy')
            .createTable(request.tableName, function (t) {
                t.uuid("id", { primaryKey: true }).defaultTo(knexConfig.raw("uuid_generate_v4()"));
                // Loop through properties
                for (const property of request.properties) {
                    let tableProp;
                    switch (property.type) {
                        case PropertyTypes.STRING:
                            if (property.isEnum) {
                                tableProp = t.enu(property.propertyName, property.enumValues);
                            } else {
                                tableProp = t.string(property.propertyName);
                            }
                            break;
                        case PropertyTypes.INTEGER:
                            tableProp = t.integer(property.propertyName);
                            break;
                        case PropertyTypes.DATE:
                            tableProp = t.date(property.propertyName);
                            break;
                        case PropertyTypes.DATETIME:
                            tableProp = t.dateTime(property.propertyName);
                            break;
                        case PropertyTypes.BOOLEAN:
                            tableProp = t.boolean(property.propertyName);
                            break;
                        case PropertyTypes.FLOAT:
                            tableProp = t.float(property.propertyName);
                            break;
                        case PropertyTypes.ASSET:
                            tableProp = t.string(property.propertyName);
                            break;
                    }
                    property.required ? tableProp.notNullable() : tableProp.nullable();
                    if (property.isUnique) {
                        tableProp.unique();
                    }
                }
                t.timestamps({ useCamelCase: true, useTimestamps: true, defaultToNow: true });
            });
        return true;
    }

    public async updateTable(request: string) {

    }

    public async removeTable(request: string) {

    }

    public async insertData(collection: Collection, request: Record<string, any>) {
        const result = await knexConfig.insert(request).into(`${collection.schemaName}.${collection.tableName}`);
    }

    public async updateData(request: string) {

    }

    public async removeData(request: string) {

    }

    public async queryTable(collection: Collection, request: ICollectionItemQuery): Promise<any> {
        const r = await knexConfig.from(`${collection.schemaName}.${collection.tableName}`);
        return r;
    }
}