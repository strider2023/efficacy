
import { Body, Get, Path, Post, Queries, Route, Tags } from "tsoa";
import { CollectionService } from "../services/collection.service";
import { IAppResponse, ICollectionItemQuery } from "../interfaces";

@Route("api/collection")
@Tags("Efficacy Collection Item APIs")
export class CollectionItemController {

    @Post("{collectioName}/item")
    public async createCollectionItem(
        @Path() collectioName: string,
        @Body() request: Record<string, any>
    ): Promise<IAppResponse> {
        const success = await new CollectionService().createCollectionItem(collectioName, request);
        const response: IAppResponse = {
            status: success ? 201 : 500,
            message: success ? `Entry created successfully` : `Unable to created entry`
        }
        return response;
    }

    @Get("{collectioName}/items")
    public async getCollectionItems(
        @Path() collectioName: string,
        @Queries() request: ICollectionItemQuery
    ): Promise<any> {
        return new CollectionService().getCollectionItems(collectioName, request);
    }
}