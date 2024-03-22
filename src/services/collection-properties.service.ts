import { BaseService } from "./base.service";
import { CollectionProperty, Collections } from "../schemas";
import { TABLE_COLLECTIONS, TABLE_COLLECTION_PROPERTIES } from "../constants/tables.constants";
import { CreateCollectionProperty, UpdateCollectionProperty } from "../interfaces";
import { Status } from "../enums";
import { ApiError } from "../errors";
import { SchemaBuilder, UIBuilder } from "../utilities";
import { ActivityService } from "./activity.service";
import * as _ from "lodash";

export class CollectionPropertiesService extends BaseService<CollectionProperty> {

    constructor(email: string) {
        super(TABLE_COLLECTION_PROPERTIES, 'Collection Properties', email);
    }

    public async getUIProperties(collectionId: string, platform: string): Promise<any> {
        try {
            const response = await this.db
                .from(this.tableName)
                .where('collectionId', collectionId)
                .where('isLatest', true)
                .where('status', Status.ACTIVE);
            return UIBuilder.getConfig(platform, response);
        } catch (e) {
            throw new ApiError(`Error creating UI View`, 500, e.message);
        }
    }

    public async createProperties(request: CreateCollectionProperty[]) {
        try {
            const collection = await this.getCollection(request[0].collectionId);
            for (const property of request) {
                await new SchemaBuilder().addTableProperty(collection.schemaName, collection.tableName, property);
                this.create(property);
            }
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }

    public async createProperty(property: CreateCollectionProperty) {
        try {
            const collection = await this.getCollection(property.collectionId);
            await new SchemaBuilder().addTableProperty(collection.schemaName, collection.tableName, property);
            const id = this.create(property);
            new ActivityService().create({ action: "create", tableName: TABLE_COLLECTION_PROPERTIES, objectId: id[0] });
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }

    public async updateProperty(
        collectionId: string,
        property: UpdateCollectionProperty,
        propertyName: string) {
        try {
            const collection = await this.getCollection(collectionId);
            // Get latest version
            const collectionProperty = await this.get(propertyName, 'propertyName');
            let updatedProperty = _.merge({}, collectionProperty, property);
            updatedProperty = _.omit(updatedProperty, ['id', 'status', 'createdAt', 'updatedAt']);
            const difference = _.pickBy(updatedProperty, (v, k) => !_.isEqual(collectionProperty[k], v));
            if (!_.isEmpty(difference)) {
                await new SchemaBuilder().updateTableProperty(
                    collection.schemaName,
                    collection.tableName,
                    updatedProperty);
            }
            await this.update(property, propertyName, 'propertyName');
        } catch (e) {
            throw new ApiError(`Error updating entry in ${this.entityName}`, 500, e.message);
        }
    }

    public async deleteProperty(collectionId: string, propertyName: string) {
        try {
            const collection = await this.getCollection(collectionId);
            await new SchemaBuilder().removeTableProperty(collection.schemaName, collection.tableName, propertyName);
            this.delete(propertyName, 'propertyName');
        } catch (e) {
            throw new ApiError(`Error removing entry in ${this.entityName}`, 500, e.message);
        }
    }

    /////////////// Private functions //////////////////////

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