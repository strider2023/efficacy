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