import { Collection } from "./entities/collection.entity";
import { CollectionMetadataProperty } from "./entities/collection-metadata-property.entity";
import { CreateCollection } from "./interfaces/create-collection.interface";
import { Application } from "../application/application.entity";
import { MedataProperty } from "./interfaces/metadata-property.interface";
import { Status } from "../common/enums";
import { SchemaBuilder } from "./utils/schema-builder";
import { CollectionItemQuery } from "./interfaces/create-item.interface";

export class CollectionService {

    public async getAllByAppId(appName: string): Promise<Collection[]> {
        const app = await Application.findOneBy({ name: appName });
        const collections = await Collection.find({
            where: {
                status: Status.ACTIVE,
                application: app
            }
        });
        return collections;
    }

    public async getCollectionProperties(collectioName: string): Promise<CollectionMetadataProperty[]> {
        const collection = await Collection.findOneBy({ name: collectioName, status: Status.ACTIVE });
        const properties = await CollectionMetadataProperty.find({
            where: {
                status: Status.ACTIVE,
                collection: collection,
            }
        })
        return properties;
    }


    public async create(request: CreateCollection): Promise<Collection> {
        const sb = new SchemaBuilder();
        const schemaName = await sb.createTable(request);
        
        // Create new collection
        const app = await Application.findOneBy({ name: request.application });
        const existingCollection = await Collection.findOneBy({ application: app, name: request.name });
        const collection = existingCollection ? existingCollection : new Collection();
        collection.name = request.name;
        collection.description = request.description;
        collection.schemaName = schemaName;
        collection.application = app;
        await collection.save();

        //Loop through the properties
        // const properties: CollectionMetadataProperty[] = []
        for (const property of request.properties) {
            this.createMetadataProperty(property, collection);
        }
        // collection.properties = properties;
        // await collection.save();

        return collection;
    }

    public async createCollectionItem(
        collectioName: string, 
        request: Record<string, any>) {
        // Check if collection exists
        const collection = await Collection.findOneBy({ name: collectioName, status: Status.ACTIVE });
        if (collection) {
            // TODO: Validate Request
            const sb = new SchemaBuilder();
            await sb.insertData(collection.schemaName, request);
        }
    }

    public async getCollectionItems(
        collectioName: string, 
        request: CollectionItemQuery): Promise<any> {
        // Check if collection exists
        const collection = await Collection.findOneBy({ name: collectioName, status: Status.ACTIVE });
        if (collection) {
            // TODO: Validate Request
            const sb = new SchemaBuilder();
            const resp = await sb.queryTable(collection.schemaName, request);
            return resp;
        }
        return [];
    }

    /////////////////////////////// Private Methods //////////////////////////////////

    private async createMetadataProperty(
        prop: MedataProperty, collection: Collection, parent?: CollectionMetadataProperty): Promise<CollectionMetadataProperty> {
        const existingProperty = await CollectionMetadataProperty.findOneBy({ collection: collection, propertyName: prop.propertyName });
        const mp = existingProperty ? existingProperty : new CollectionMetadataProperty();
        mp.collection = collection;
        mp.propertyName = prop.propertyName;
        mp.propertyType = prop.propertyType;
        mp.required = prop.required;
        mp.description = prop.description;
        mp.default = prop.default;
        mp.maximum = prop.maximum;
        mp.minimum = prop.minimum;
        mp.pattern = prop.pattern;
        mp.isEnum = prop.isEnum;
        mp.enumValues = prop.enumValues;
        //If parent defined in request
        if (prop.parent) {
            const p = await CollectionMetadataProperty.findOneBy({
                collection: collection,
                propertyName: parent.propertyName
            });
            mp.parent = p;
        }
        //In case of recurrions
        if (parent) {
            mp.parent = parent;
        }
        await mp.save()

        // Recurssion for children in the tree
        if (prop.children && prop.children.length > 0) {
            const properties: CollectionMetadataProperty[] = [];
            for (const property of prop.children) {
                this.createMetadataProperty(property, collection, mp);
                properties.push(await this.createMetadataProperty(property, collection, mp));
            }
            mp.children = properties;
            await collection.save();
        }
        return mp;
    }
}