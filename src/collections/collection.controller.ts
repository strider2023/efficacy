
import { Body, Example, Get, Path, Post, Queries, Route, Tags } from "tsoa";
import { CreateCollection } from "./interfaces/create-collection.interface";
import { Collection } from "./entities/collection.entity";
import { CollectionService } from "./collection.service";
import { CollectionMetadataProperty } from "./entities/collection-metadata-property.entity";
import { CollectionItemQuery } from "./interfaces/create-item.interface";
import { CollectionQueryParams } from "./interfaces/collection-query.interface";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController {

    @Get()
    public async getCollections(
        @Queries() queryParams: CollectionQueryParams
    ): Promise<Collection[]> {
        return new CollectionService().getAllByAppId(queryParams);
    }

    @Get("{collectioName}/properties")
    public async getCollectionProperties(
        @Path() collectioName: string
    ): Promise<CollectionMetadataProperty[]> {
        return new CollectionService().getCollectionProperties(collectioName);
    }

    @Example<CreateCollection>({
        "name": "User",
        "application": "test",
        "properties": [
            {
                "propertyName": "firstname",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "middlename",
                "propertyType": "string",
                "required": false
            },
            {
                "propertyName": "lastname",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "gender",
                "propertyType": "string",
                "required": false,
                "isEnum": true,
                "enumValues": [
                    "Male",
                    "Female",
                    "Neutral"
                ]
            },
            {
                "propertyName": "email",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "dateOfBirth",
                "propertyType": "date",
                "required": true
            }
        ]
    })
    @Post()
    public async createCollection(
        @Body() request: CreateCollection)
        : Promise<Collection> {
        return new CollectionService().create(request);
    }

    @Post("{collectioName}/item")
    public async createCollectionItem(
        @Path() collectioName: string,
        @Body() request: Record<string, any>
    ): Promise<void> {
        return new CollectionService().createCollectionItem(collectioName, request);
    }

    @Post("{collectioName}/items")
    public async getCollectionItems(
        @Path() collectioName: string,
        @Body() request: CollectionItemQuery
    ): Promise<any> {
        return new CollectionService().getCollectionItems(collectioName, request);
    }
}