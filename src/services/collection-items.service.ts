import { SchemaBuilder } from "../utilities";
import { Status } from "../enums";
import {
    Collection, MetadataProperty
} from "../entities";
import {
    ICollectionAttributes,
    ICollectionItems,
    ICollectionItemsQuery,
} from "../interfaces";
import { ApiError } from "../errors";
import { Controller } from "tsoa";

export class CollectionItemsService extends Controller {

    public async getCollectionProperties(collectionId: string): Promise<ICollectionAttributes[]> {
        const properties = await MetadataProperty.find({
            where: {
                collection: {
                    collectionId: collectionId
                },
                status: Status.ACTIVE,
            },
            select: {
                propertyName: true,
                displayName: true,
                type: true,
            }
        });
        return properties;
    }

    public async createCollectionItem(
        collectionId: string,
        request: Record<string, any>) {
        // Check if collection exists
        const collection = await Collection.findOneBy({
            collectionId: collectionId,
            status: Status.ACTIVE
        });
        if (collection) {
            // TODO: Validate Request
            try {
                await new SchemaBuilder()
                    .insertData(
                        `${collection.schemaName}.${collection.tableName}`,
                        request);
            } catch (e) {
                throw new ApiError("Update Collection Item", 500, e.message);
            }
        }
    }

    public async updateCollectionItem(
        collectionId: string,
        itemId: string,
        request: Record<string, any>) {
        // Check if collection exists
        const collection = await Collection.findOneBy({
            collectionId: collectionId,
            status: Status.ACTIVE
        });
        if (collection) {
            // TODO: Validate Request
            try {
                await new SchemaBuilder().updateData(
                    itemId,
                    `${collection.schemaName}.${collection.tableName}`,
                    request);
            } catch (e) {
                throw new ApiError("Update Collection Item", 500, e.message);
            }
        }
    }

    public async removeCollectionItem(
        collectionId: string,
        itemId: string) {
        // Check if collection exists
        const collection = await Collection.findOneBy({
            collectionId: collectionId,
            status: Status.ACTIVE
        });
        if (collection) {
            // TODO: Validate Request
            try {
                await new SchemaBuilder().removeData(
                    itemId,
                    `${collection.schemaName}.${collection.tableName}`);
            } catch (e) {
                throw new ApiError("Update Collection Item", 500, e.message);
            }
        }
    }

    public async getCollectionItem(
        collectionId: string,
        itemId: string): Promise<Record<string, any>> {
        // Check if collection exists
        const collection = await Collection.findOneBy({
            collectionId: collectionId,
            status: Status.ACTIVE
        });
        if (collection) {
            // TODO: Validate Request
            try {
                return await new SchemaBuilder().getData(
                    itemId,
                    `${collection.schemaName}.${collection.tableName}`);
            } catch (e) {
                throw new ApiError("Update Collection Item", 500, e.message);
            }
        }
    }

    public async getCollectionItems(
        collectionId: string,
        request: ICollectionItemsQuery): Promise<ICollectionItems> {
        let response: ICollectionItems = {
            result: []
        }
        // Check if collection exists
        const collection = await Collection.findOneBy({
            collectionId: collectionId,
            status: Status.ACTIVE
        });
        if (collection) {
            response = await new SchemaBuilder().queryTable(collection, request);
            return response;
        }
        return response;
    }
}