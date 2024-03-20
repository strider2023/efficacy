import { CreateCollection, CreateCollectionProperty } from "../interfaces";
import { getDatabaseAdapter } from "../database/knex-config";
import { ApiError } from "../errors";

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

    public async removeTable(schemaName: string, tableName: string) {
        try {
            await getDatabaseAdapter().schema.withSchema(schemaName)
                .dropTableIfExists(tableName);
        } catch (e) {
            throw new ApiError("Create Collection Error", 500, e.message);
        }
    }

    public async addTableProperty(schemaName: string, tableName: string, props: CreateCollectionProperty[]) {
        try {
            await getDatabaseAdapter().schema.withSchema(schemaName)
                .dropTableIfExists(tableName);
        } catch (e) {
            throw new ApiError("Create Collection Error", 500, e.message);
        }
    }

    // for (const property of request.properties) {
    //     let tableProp;
    //     switch (property.type) {
    //         case PropertyTypes.STRING:
    //             if (property.isEnum) {
    //                 tableProp = t.enu(property.propertyName, property.enumValues);
    //             } else {
    //                 tableProp = t.string(property.propertyName);
    //             }
    //             break;
    //         case PropertyTypes.INTEGER:
    //             tableProp = t.integer(property.propertyName);
    //             break;
    //         case PropertyTypes.DATE:
    //             tableProp = t.date(property.propertyName);
    //             break;
    //         case PropertyTypes.DATETIME:
    //             tableProp = t.dateTime(property.propertyName);
    //             break;
    //         case PropertyTypes.BOOLEAN:
    //             tableProp = t.boolean(property.propertyName);
    //             break;
    //         case PropertyTypes.FLOAT:
    //             tableProp = t.float(property.propertyName);
    //             break;
    //         case PropertyTypes.ASSET:
    //             tableProp = t.string(property.propertyName);
    //             break;
    //         case PropertyTypes.ARRAY:
    //             tableProp = t
    //                 .uuid(`${property.propertyName}_id`)
    //                 .foreign(`${property.propertyName}_id`)
    //                 .references("id")
    //                 .inTable(property.reference)
    //                 .onDelete("CASCADE");
    //             break;
    //         case PropertyTypes.OBJECT:
    //             tableProp = t
    //                 .uuid(`${property.propertyName}_id`)
    //                 .foreign(`${property.propertyName}_id`)
    //                 .references("id")
    //                 .inTable(property.reference)
    //                 .onDelete("CASCADE");
    //             break;
    //     }
    //     property.required ? tableProp.notNullable() : tableProp.nullable();
    //     if (property.isUnique) {
    //         tableProp.unique();
    //     }
    // }
}