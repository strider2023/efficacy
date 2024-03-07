import { SchemaBuilder } from "../utilities";
import { Status } from "../enums";
import { 
    ArrayViewProperty, 
    Collection, 
    MetadataProperty, 
    MetadataViewProperty } from "../entities";
import { 
    IArrayViewProperty, 
    ICollection, 
    ICollectionItemQuery, 
    ICollectionQueryParams, 
    IMetadataProperty, 
    IMetadataViewProperty 
} from "../interfaces";

export class CollectionService {

    public async syncCollections() {
        new SchemaBuilder().syncTables();
    }

    public async getAllByAppId(queryParams: ICollectionQueryParams): Promise<Collection[]> {
        const query = { status: Status.ACTIVE }
        const collections = await Collection.find({
            where: query
        });
        return collections;
    }

    public async getCollectionProperties(collectioName: string): Promise<MetadataProperty[]> {
        const collection = await Collection.findOneBy({ collectionId: collectioName, status: Status.ACTIVE });
        const properties = await MetadataProperty.find({
            where: {
                collection: {
                    id: collection.id
                },
                status: Status.ACTIVE,
            }
        });
        return properties;
    }


    public async create(request: ICollection): Promise<Collection> {
        const success = await new SchemaBuilder().createTable(request);
        const existingCollection = await Collection.findOneBy({ collectionId: request.collectionId });
        const collection = existingCollection ? existingCollection : new Collection();
        collection.collectionId = request.collectionId;
        collection.displayName = request.displayName;
        collection.description = request.description;
        collection.schemaName = request.schemaName || 'efficacy';
        collection.tableName = request.tableName;
        await collection.save();

        console.log(collection);

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
        request: Record<string, any>): Promise<boolean> {
        // Check if collection exists
        const collection = await Collection.findOneBy({ collectionId: collectioName, status: Status.ACTIVE });
        if (collection) {
            // TODO: Validate Request
            try {
                await new SchemaBuilder().insertData(collection, request);
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        }
        return false;
    }

    public async getCollectionItems(
        collectioName: string,
        request: ICollectionItemQuery): Promise<any> {
        // Check if collection exists
        const collection = await Collection.findOneBy({ collectionId: collectioName, status: Status.ACTIVE });
        if (collection) {
            // TODO: Validate Request
            const resp = await new SchemaBuilder().queryTable(collection, request);
            return resp;
        }
        return [];
    }

    /////////////////////////////// Private Methods //////////////////////////////////

    private async createMetadataProperty(
        prop: IMetadataProperty, collection: Collection, parent?: MetadataProperty): Promise<MetadataProperty> {

        const formProperty = prop.viewProperty ? await this.createFormProperty(prop.viewProperty) : null;
        const arrayProperty = prop.arrayOptions ? await this.createArrayOptions(prop.arrayOptions): null;

        const existingProperty = await MetadataProperty.findOneBy({ collection: collection, propertyName: prop.propertyName });
        const mp = existingProperty ? existingProperty : new MetadataProperty();

        mp.collection = collection;
        mp.viewProperty = formProperty;
        mp.arrayOptions = arrayProperty;
        mp.propertyName = prop.propertyName;
        mp.displayName = prop.displayName;
        mp.type = prop.type;
        mp.required = prop.required;
        mp.description = prop.description;
        mp.default = prop.default;
        mp.isUnique = prop.isUnique;
        mp.maximum = prop.maximum;
        mp.minimum = prop.minimum;
        mp.pattern = prop.pattern;
        mp.isEnum = prop.isEnum;
        mp.enumValues = prop.enumValues;
        //If parent defined in request
        if (prop.parent) {
            const p = await MetadataProperty.findOneBy({
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
            const properties: MetadataProperty[] = [];
            for (const property of prop.children) {
                this.createMetadataProperty(property, collection, mp);
                properties.push(await this.createMetadataProperty(property, collection, mp));
            }
            mp.children = properties;
            await collection.save();
        }
        return mp;
    }

    private async createFormProperty(fp: IMetadataViewProperty): Promise<MetadataViewProperty> {
        const property = new MetadataViewProperty()
        property.widget = fp.widget
        property.inputType = fp.inputType
        property.autocomplete = fp.autocomplete
        property.autofocus = fp.autofocus
        property.disabled = fp.disabled
        property.readonly = fp.readonly
        property.enumDisabled = fp.enumDisabled
        property.filePreview = fp.filePreview
        property.helpText = fp.helpText
        property.hideError = fp.hideError
        property.placeholder = fp.placeholder
        property.acceptedFileExtendsions = fp.acceptedFileExtendsions
        property.rows = fp.rows
        property.yearsRangeStart = fp.yearsRangeStart
        property.yearRangeEnd = fp.yearRangeEnd
        property.format = fp.format
        await property.save();
        return property;
    }

    private async createArrayOptions(prop: IArrayViewProperty): Promise<ArrayViewProperty> {
        const property = new ArrayViewProperty();
        property.orderable = prop.orderable;
        property.addable = prop.addable;
        property.copyable = prop.copyable;
        property.removable = prop.removable;
        await property.save();
        return property;
    }
}