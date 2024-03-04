
import { Body, Get, Path, Post, Route, Tags } from "tsoa";
import { CreateCollection } from "./interfaces/create-collection.interface";
import { Collection } from "./entities/collection.entity";
import { CollectionService } from "./collection.service";
import { CollectionMetadataProperty } from "./entities/collection-metadata-property.entity";
import { CollectionItemQuery } from "./interfaces/create-item.interface";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController {

    @Get("{appName}")
    public async getCollections(
        @Path() appName: string
    ): Promise<Collection[]> {
        return new CollectionService().getAllByAppId(appName);
    }

    @Get("{collectioName}/properties")
    public async getCollectionProperties(
        @Path() collectioName: string
    ): Promise<CollectionMetadataProperty[]> {
        return new CollectionService().getCollectionProperties(collectioName);
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

    @Post()
    public async createCollection(
        @Body() request: CreateCollection)
        : Promise<Collection> {
        return new CollectionService().create(request);
    }
}