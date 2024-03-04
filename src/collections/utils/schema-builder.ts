import { PropertyTypes, Status } from "../../common/enums";
import { knexConfig } from "../../knex-config";
import { CreateCollection } from "../interfaces/create-collection.interface";
import { CollectionItemQuery } from "../interfaces/create-item.interface";

export class SchemaBuilder {

    constructor() { }

    public async createTable(appName: string, request: CreateCollection): Promise<string> {
        const tableName = `${appName}_${request.name}`;
        let uniqueColumns: string[] = [];
        await knexConfig.schema.dropTableIfExists(tableName);
        await knexConfig.schema.withSchema('public')
            .createTable(tableName, function (t) {
                t.increments('id').primary();
                for (const property of request.properties) {
                    let tableProp;
                    switch (property.propertyType) {
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
        return tableName;
    }

    public async updateTable(request: string) {

    }

    public async removeTable(request: string) {

    }

    public async insertData(collectioName: string, request: Record<string, any>) {
        const result = await knexConfig.insert(request).into(collectioName);
    }

    public async updateData(request: string) {

    }

    public async removeData(request: string) {

    }

    public async queryTable(collectioName: string, request: CollectionItemQuery): Promise<any> {
        const r = await knexConfig.from(collectioName);
        console.log(r);
        return r;
    }
}