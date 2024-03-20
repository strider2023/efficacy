import { BaseService } from "./base.service";
import { CollectionProperty, Collections } from "../schemas";
import { TABLE_COLLECTIONS, TABLE_COLLECTION_PROPERTIES } from "../constants/tables.constants";
import { CreateCollectionProperty } from "../interfaces";
import { Status } from "../enums";
import { ApiError } from "../errors";
import { SchemaBuilder } from "../utilities";

export class CollectionPropertiesService extends BaseService<CollectionProperty> {

    constructor() {
        super(TABLE_COLLECTION_PROPERTIES, 'Collection Properties')
    }

    public async createProperties(request: CreateCollectionProperty[]) {
        const collection = await this.getCollection(request[0].collectionId);
        for (const property of request) {
            await new SchemaBuilder().addTableProperty(collection.schemaName, collection.tableName, property);
            this.create({ ...property, version: 1 });
        }
    }

    public async createProperty(property: CreateCollectionProperty) {
        const collection = await this.getCollection(property.collectionId);
        await new SchemaBuilder().addTableProperty(collection.schemaName, collection.tableName, property);
        this.create({ ...property, version: 1 });
    }

    public async deleteProperty(propertyName: string) {
        try {
            const property = await this.get(propertyName);
            const collection = await this.getCollection(property.collectionId);
            await new SchemaBuilder().removeTableProperty(collection.schemaName, collection.tableName, propertyName);
            this.delete(propertyName, 'propertyName');
        } catch (e) {
            throw new ApiError(`Error removing entry in ${this.entityName}`, 500, e.message);
        }
    }

    public async get(propertyName: string): Promise<CollectionProperty> {
        try {
            const response = await this.db
                .from(this.tableName)
                .where('propertyName', propertyName)
                .where('isLatest', true)
                .where('status', Status.ACTIVE)
                .first();
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    }

    private async getCollection(collectionId: string): Promise<Collections> {
        try {
            const response = await this.db
                .from(TABLE_COLLECTIONS)
                .where('collectionId', collectionId)
                .where('isLatest', true)
                .where('status', Status.ACTIVE)
                .first();
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    }
}