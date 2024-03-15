
import { Body, Controller, Example, Get, Path, Post, Queries, Route, Security, Tags, SuccessResponse, Delete, Put } from "tsoa";
import { Collection } from "../entities";
import { CollectionService } from "../services";
import { ICollection, IAppQueryParams } from "../interfaces";
import { MetadataProperty } from "../entities";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController extends Controller {

    @Get("sync")
    @Security("jwt", ["admin"])
    public async syncCollections(
    ): Promise<string> {
        try {
            await new CollectionService().syncCollections();
        } catch (e) {
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

    @Get("{collectionId}")
    @Security("jwt", ["admin", "portal_user"])
    public async getCollection(
        @Path() collectionId: string
    ): Promise<Collection> {
        return new CollectionService().getCollectionById(collectionId);
    }

    @Get("{collectionId}/properties")
    @Security("jwt", ["admin", "portal_user"])
    public async getCollectionProperties(
        @Path() collectionId: string
    ): Promise<MetadataProperty[]> {
        return new CollectionService().getCollectionProperties(collectionId);
    }

    @Get("{collectionId}/page-config/{adapter}")
    public async getCollectionPageConfig(
        @Path() collectionId: string,
        @Path() adapter: string
    ): Promise<any> {
        return new CollectionService().getCollectionPageConfig(collectionId, adapter);
    }

    @SuccessResponse("201", "Created")
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
        : Promise<void> {
        this.setStatus(201)
        await new CollectionService().create(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{collectionId}")
    @Security("jwt", ["admin", "portal_user"])
    public async update(
        @Path() collectionId: string,
        @Body() request: ICollection
    ): Promise<void> {
        await new CollectionService().update(collectionId, request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{collectionId}")
    @Security("jwt", ["admin", "portal_user"])
    public async delete(
        @Path() collectionId: string,
    ): Promise<void> {
        await new CollectionService().delete(collectionId);
        return;
    }
}