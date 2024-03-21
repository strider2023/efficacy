import { BaseService } from "./base.service";
import { CollectionProperty, Collections } from "../schemas";
import { TABLE_COLLECTIONS, TABLE_COLLECTION_PROPERTIES } from "../constants/tables.constants";
import { CreateCollectionProperty, UpdateCollectionProperty } from "../interfaces";
import { Status } from "../enums";
import { ApiError } from "../errors";
import { SchemaBuilder, UIBuilder } from "../utilities";
import { ActivityService } from "./activity.service";

export class CollectionPropertiesService extends BaseService<CollectionProperty> {

    constructor() {
        super(TABLE_COLLECTION_PROPERTIES, 'Collection Properties')
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
                this.create({ ...property, version: 1 });
            }
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }

    public async createProperty(property: CreateCollectionProperty) {
        try {
            const collection = await this.getCollection(property.collectionId);
            await new SchemaBuilder().addTableProperty(collection.schemaName, collection.tableName, property);
            const id = this.create({ ...property, version: 1 });
            new ActivityService().create({ action: "create", tableName: TABLE_COLLECTION_PROPERTIES, objectId: id[0] });
        } catch (e) {
            throw new ApiError(`Error creating entry for ${this.entityName}`, 500, e.message);
        }
    }

    public async updateProperty(property: UpdateCollectionProperty, propertyName: string) {
        try {
            // Get latest version
            const collectionProperty = await this.get(propertyName);
            let updatedProperty = {
                collectionId: collectionProperty.collectionId,
                propertyName: collectionProperty.propertyName,
                displayName: property.displayName || collectionProperty.displayName,
                description: property.description || collectionProperty.description,
                type: collectionProperty.type,
                isRequired: property.isRequired || collectionProperty.isRequired,
                isUnique: collectionProperty.isRequired,
                default: property.default || collectionProperty.default,
                regex: property.regex || collectionProperty.regex,
                stringOneOf: property.stringOneOf || collectionProperty.stringOneOf,
                stringNoneOf: property.stringNoneOf || collectionProperty.stringNoneOf,
                stringLengthCheckOperator: property.stringLengthCheckOperator || collectionProperty.stringLengthCheckOperator,
                stringLengthCheck: property.stringLengthCheck || collectionProperty.stringLengthCheck,
                setNumberPositive: property.setNumberPositive || collectionProperty.setNumberPositive,
                setNumberNegative: property.setNumberNegative || collectionProperty.setNumberNegative,
                minimum: property.minimum || collectionProperty.minimum,
                maximum: property.maximum || collectionProperty.maximum,
                checkNumberRange: property.checkNumberRange || collectionProperty.checkNumberRange,
                numericPrecision: property.numericPrecision || collectionProperty.numericPrecision,
                numericScale: property.numericScale || collectionProperty.numericScale,
                enumValues: property.enumValues || collectionProperty.enumValues,
                dateFormat: property.dateFormat || collectionProperty.dateFormat,
                foreignKeyColumn: property.foreignKeyColumn || collectionProperty.foreignKeyColumn,
                foreignKeySchema: property.foreignKeySchema || collectionProperty.foreignKeySchema,
                foreignKeyTable: property.foreignKeyTable || collectionProperty.foreignKeyTable,
                additionalMetadata: property.additionalMetadata || collectionProperty.additionalMetadata,
                version: collectionProperty.version + 1
            }
            this.create(updatedProperty);
            // Change previous version status
            await this.db
                .into(this.tableName)
                .where('id', collectionProperty.id)
                .update({ status: Status.DELETED, isLatest: false });
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