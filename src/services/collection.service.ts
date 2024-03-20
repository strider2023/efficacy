import { SchemaBuilder } from "../utilities";
import { BaseService } from "./base.service";
import { Collections } from "../schemas";
import { SYSTEM_TABLES, TABLE_COLLECTIONS } from "../constants/tables.constants";
import { CreateCollection, UpdateCollection } from "../interfaces";
import { ApiError } from "../errors";
import { Status } from "../enums";

export class CollectionService extends BaseService<Collections> {

    constructor() {
        super(TABLE_COLLECTIONS, 'Collections')
    }

    public async syncCollections() {
        new SchemaBuilder().syncTables();
    }

    public async createCollection(request: CreateCollection) {
        if (SYSTEM_TABLES.includes(request.tableName)) {
            throw new ApiError("Collection Creation Error", 500, "Table name is system reserved.")
        }
        await new SchemaBuilder().createTable(request)
        this.create({ ...request, version: 1 });
    }

    public async updateCollection(request: UpdateCollection, collectionId: string) {
        // Get latest version
        const collection = await this.get(collectionId);
        const updatedCollection = {
            collectionId: collectionId,
            displayName: request.displayName || collection.displayName,
            description: request.description || collection.description,
            schemaName: collection.schemaName,
            tableName: collection.tableName,
            permissions: request.permissions || collection.permissions,
            version: collection.version + 1,
            useTimestamps: collection.useTimestamps
        }
        this.create(updatedCollection);
        // Change previous version status
        await this.db
                .into(this.tableName)
                .where('id', collection.id)
                .update({ status: Status.DELETED, isLatest: false });
    }

    public async deleteCollection(collectionId: string) {
        const collection = await this.get(collectionId);
        await new SchemaBuilder().removeTable(collection.schemaName, collection.tableName)
        this.delete(collectionId, 'collectionId');
    }

    public async get(collectionId: string): Promise<Collections> {
        try {
            const response = await this.db
                .from(this.tableName)
                .where('collectionId', collectionId)
                .where('isLatest', true)
                .where('status', Status.ACTIVE)
                .first();
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    }

    public async getHistory(collectionId: string): Promise<Collections[]> {
        try {
            const response = await this.db
                .from(this.tableName)
                .where('collectionId', collectionId);
            return response;
        } catch (e) {
            throw new ApiError(`Error fetching entry from ${this.entityName}`, 500, e.message);
        }
    }
}