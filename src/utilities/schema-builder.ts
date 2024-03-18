import { ICollection, ICollectionItems, ICollectionItemsQuery } from "../interfaces";
import { CollectionItemFilterOperations, PropertyTypes } from "../enums";
import { getDatabaseAdapter } from "../database/knex-config";
import { Collection } from "../entities";

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

    public async createTable(request: ICollection): Promise<boolean> {
        await getDatabaseAdapter().schema.dropTableIfExists(request.tableName);
        await getDatabaseAdapter().schema.withSchema(request.schemaName || 'efficacy')
            .createTable(request.tableName, function (t) {
                t.uuid("id", { primaryKey: true }).defaultTo(getDatabaseAdapter().raw("uuid_generate_v4()"));
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

    public async removeTable(schemaName: string, tableName: string) {
        await getDatabaseAdapter().schema.withSchema(schemaName)
            .dropTableIfExists(tableName);
    }

    public async getData(itemId: string, tableName: string): Promise<Record<string, any>> {
        const result = await getDatabaseAdapter()
            .from(tableName)
            .where({ id: itemId })
            .first();
        return result;
    }

    public async insertData(tableName: string, request: Record<string, any>) {
        await getDatabaseAdapter()
            .insert(request)
            .into(tableName);
    }

    public async updateData(itemId: string, tableName: string, request: Record<string, any>) {
        await getDatabaseAdapter()(tableName)
            .where({ id: itemId })
            .update(request);
    }

    public async removeData(itemId: string, tableName: string) {
        await getDatabaseAdapter()(tableName)
            .where({ id: itemId })
            .del();
    }

    public async queryTable(collection: Collection, query: ICollectionItemsQuery): Promise<ICollectionItems> {
        const response: ICollectionItems = {
            result: []
        }
        try {
            const queryProps = getDatabaseAdapter().from(`${collection.schemaName}.${collection.tableName}`);
            if (query.properties) {
                queryProps.select(query.properties);
            }
            if (query.offset) {
                queryProps.offset(query.offset);
            }
            if (query.limit) {
                queryProps.limit(query.limit);
            }
            if (query.sortByProperty) {
                queryProps.orderBy(query.sortByProperty, query.ascending ? 'asc' : 'desc');
            }
            if (query.filterByProperty && query.filterValue && query.filterOperation) {
                if (query.filterOperation === CollectionItemFilterOperations.LIKE) {
                    queryProps.where(query.filterByProperty, query.filterOperation, `%${query.filterValue.replaceAll('%', '\\%')}%`);
                } else {
                    queryProps.where(query.filterByProperty, query.filterOperation, query.filterValue);
                }
            }
            response.result = await queryProps;
            if (query.showCount) {
                response.count = await getDatabaseAdapter().from(`${collection.schemaName}.${collection.tableName}`).count('id');
            }
        } catch (e) {
            console.error(e);
        }
        return response;
    }
}