import { PropertyTypes, Status } from "../../common/enums";
import { knexConfig } from "../../knex-config";
import { CreateCollection } from "../interfaces/create-collection.interface";
import { CollectionItemQuery } from "../interfaces/create-item.interface";

export class SchemaBuilder {

    constructor() { }

    public async createTable(request: CreateCollection): Promise<string> {
        await knexConfig.schema.dropTableIfExists(`efficacy_${request.name}`);
        await knexConfig.schema.withSchema('public')
            .createTable(`efficacy_${request.name}`, function (t) {
                t.increments('id').primary();
                for (const property of request.properties) {
                    switch (property.propertyType) {
                        case PropertyTypes.STRING:
                            t.string(property.propertyName);
                            break;
                        case PropertyTypes.INTEGER:
                            t.integer(property.propertyName);
                            break;
                        case PropertyTypes.DATE:
                            t.date(property.propertyName);
                            break;
                        case PropertyTypes.DATETIME:
                            t.dateTime(property.propertyName);
                            break;
                        case PropertyTypes.BOOLEAN:
                            t.boolean(property.propertyName);
                            break;
                        case PropertyTypes.FLOAT:
                            t.float(property.propertyName);
                            break;
                        case PropertyTypes.ASSET:
                            t.string(property.propertyName);
                            break;
                    }
                    // if (!property.required) {
                    //     t.setNullable(property.propertyName);
                    // }
                }
                t.timestamps();
            });
        return `efficacy_${request.name}`;
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