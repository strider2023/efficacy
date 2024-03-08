
import { Body, Delete, Get, Path, Post, Put, Queries, Route, Tags } from "tsoa";
import { CollectionItemsService } from "../services";
import { IAppResponse, ICollectionItems, ICollectionItemsQuery } from "../interfaces";

@Route("api/collection")
@Tags("Efficacy Collection Item APIs")
export class CollectionItemController {

    @Get("{collectionId}/items")
    public async getCollectionItems(
        @Path() collectionId: string,
        @Queries() query: ICollectionItemsQuery
    ): Promise<ICollectionItems> {
        const response: ICollectionItems = await new CollectionItemsService().getCollectionItems(collectionId, query);
        if (query.showAttributes) {
            response.attributes = await new CollectionItemsService().getCollectionProperties(collectionId);
        }
        return response;
    }

    @Get("{collectionId}/item/{itemId}")
    public async getCollectionItem(
        @Path() collectionId: string,
        @Path() itemId: string,
    ): Promise<Record<string, any>> {
        return await new CollectionItemsService().getCollectionItem(collectionId, itemId);
    }

    @Post("{collectionId}/item")
    public async createCollectionItem(
        @Path() collectionId: string,
        @Body() request: Record<string, any>
    ): Promise<IAppResponse> {
        const success = await new CollectionItemsService().createCollectionItem(collectionId, request);
        const response: IAppResponse = {
            status: success ? 201 : 500,
            message: success ? `Entry created successfully` : `Unable to created entry`
        }
        return response;
    }

    @Put("{collectionId}/item/{itemId}")
    public async updateCollectionItem(
        @Path() collectionId: string,
        @Path() itemId: string,
        @Body() request: Record<string, any>
    ): Promise<IAppResponse> {
        const success = await new CollectionItemsService().updateCollectionItem(collectionId, itemId, request);
        const response: IAppResponse = {
            status: success ? 201 : 500,
            message: success ? `Entry updated successfully.` : `Unable to updated entry.`
        }
        return response;
    }

    @Delete("{collectionId}/item/{itemId}")
    public async removeCollectionItem(
        @Path() collectionId: string,
        @Path() itemId: string,
    ): Promise<IAppResponse> {
        const success = await new CollectionItemsService().removeCollectionItem(collectionId, itemId);
        const response: IAppResponse = {
            status: success ? 201 : 500,
            message: success ? `Entry removed successfully.` : `Unable to remove entry.`
        }
        return response;
    }
}