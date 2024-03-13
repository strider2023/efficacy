
import { Body, Example, Get, Path, Post, Queries, Route, Security, Tags } from "tsoa";
import { Collection } from "../entities";
import { CollectionService } from "../services";
import { ICollection, IAppQueryParams } from "../interfaces";
import { MetadataProperty } from "../entities";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController {

    @Get("sync")
    @Security("jwt", ["admin"])
    public async syncCollections(
    ): Promise<string> {
        try {
            await new CollectionService().syncCollections();
        } catch(e) {
            console.error(e);
        }
        return 'Success' 
    }

    @Get()
    @Security("jwt", ["admin", "portal_user"])
    public async getCollections(
        @Queries() queryParams: IAppQueryParams
    ): Promise<Collection[]> {
        return new CollectionService().getAllCollections(queryParams);
    }

    @Get("{collectioId}")
    @Security("jwt", ["admin", "portal_user"])
    public async getCollection(
        @Path() collectioId: string
    ): Promise<Collection> {
        return new CollectionService().getCollectionById(collectioId);
    }

    @Get("{collectioId}/properties")
    @Security("jwt", ["admin", "portal_user"])
    public async getCollectionProperties(
        @Path() collectioId: string
    ): Promise<MetadataProperty[]> {
        return new CollectionService().getCollectionProperties(collectioId);
    }

    @Get("{collectioId}/page-config/{adapter}")
    public async getCollectionPageConfig(
        @Path() collectioId: string,
        @Path() adapter: string
    ): Promise<any> {
        return new CollectionService().getCollectionPageConfig(collectioId, adapter);
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
            }
        ]
    })
    @Post()
    @Security("jwt", ["admin", "portal_user"])
    public async createCollection(
        @Body() request: ICollection)
        : Promise<Collection> {
        return new CollectionService().create(request);
    }
}