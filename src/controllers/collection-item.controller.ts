
import { Body, Controller, Delete, Get, Path, Post, Put, Queries, Route, SuccessResponse, Tags } from "tsoa";
import { CollectionItemsService } from "../services";
import { ICollectionItems, ICollectionItemsQuery } from "../interfaces";

@Route("api/collection")
@Tags("Efficacy Collection Item APIs")
export class CollectionItemController extends Controller {

    @Get("{collectionId}/items")
    public async getCollectionItems(
        @Path() collectionId: string,
        @Queries() query: ICollectionItemsQuery
    ): Promise<ICollectionItems> {
        const response: ICollectionItems = await new CollectionItemsService().getAll(collectionId, query);
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
        return await new CollectionItemsService().get(collectionId, itemId);
    }

    @SuccessResponse("201", "Created") 
    @Post("{collectionId}/item")
    public async createCollectionItem(
        @Path() collectionId: string,
        @Body() request: Record<string, any>
    ): Promise<void> {
        this.setStatus(201)
        await new CollectionItemsService().create(collectionId, request);
        return;
    }

    @SuccessResponse("200", "Updated") 
    @Put("{collectionId}/item/{itemId}")
    public async updateCollectionItem(
        @Path() collectionId: string,
        @Path() itemId: string,
        @Body() request: Record<string, any>
    ): Promise<void> {
        await new CollectionItemsService().update(collectionId, itemId, request);
        return;
    }

    @SuccessResponse("200", "Entry removed successfully.") 
    @Delete("{collectionId}/item/{itemId}")
    public async removeCollectionItem(
        @Path() collectionId: string,
        @Path() itemId: string,
    ): Promise<void> {
        await new CollectionItemsService().delete(collectionId, itemId);
        return;
    }
}