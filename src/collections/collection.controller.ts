
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
                "displayName": "First Name",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "middlename",
                "displayName": "Middle Name",
                "propertyType": "string",
                "required": false
            },
            {
                "propertyName": "lastname",
                "displayName": "Last Name",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "gender",
                "displayName": "Gender",
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
                "displayName": "Email",
                "propertyType": "string",
                "required": true
            },
            {
                "propertyName": "dateOfBirth",
                "displayName": "Date of Birth",
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

    @Get("{collectioName}/items")
    public async getCollectionItems(
        @Path() collectioName: string,
        @Queries() request: CollectionItemQuery
    ): Promise<any> {
        return new CollectionService().getCollectionItems(collectioName, request);
    }
}