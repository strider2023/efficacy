
import { Body, Example, Get, Path, Post, Queries, Route, Tags } from "tsoa";
import { Collection } from "../entities/collection.entity";
import { CollectionService } from "../services/collection.service";
import { ICollection, ICollectionQueryParams } from "../interfaces";
import { MetadataProperty } from "../entities";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController {

    @Get("sync")
    public async syncCollections(
    ): Promise<void> {
        new CollectionService().syncCollections();
    }

    @Get()
    public async getCollections(
        @Queries() queryParams: ICollectionQueryParams
    ): Promise<Collection[]> {
        return new CollectionService().getAllByAppId(queryParams);
    }

    @Get("{collectioName}/properties")
    public async getCollectionProperties(
        @Path() collectioName: string
    ): Promise<MetadataProperty[]> {
        return new CollectionService().getCollectionProperties(collectioName);
    }

    @Example<ICollection>({
        "collectionId": "user",
        "displayName": "User",
        "tableName": "user",
        "properties": [
            {
                "propertyName": "firstname",
                "displayName": "First Name",
                "type": "string",
                "required": true,
                "viewProperty": {
                    "widget": "text"
                }
            },
            {
                "propertyName": "middlename",
                "displayName": "Middle Name",
                "type": "string",
                "required": false,
                "viewProperty": {
                    "widget": "text"
                }
            },
            {
                "propertyName": "lastname",
                "displayName": "Last Name",
                "type": "string",
                "required": true,
                "viewProperty": {
                    "widget": "text"
                }
            },
            {
                "propertyName": "gender",
                "displayName": "Gender",
                "type": "string",
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
                "type": "string",
                "required": true,
                "viewProperty": {
                    "widget": "text",
                    "inputType": "email"
                }
            },
            {
                "propertyName": "dateOfBirth",
                "displayName": "Date of Birth",
                "type": "date",
                "required": true,
                "viewProperty": {
                    "widget": "text",
                    "inputType": "date"
                }
            }
        ]
    })
    @Post()
    public async createCollection(
        @Body() request: ICollection)
        : Promise<Collection> {
        return new CollectionService().create(request);
    }
}