
import { Body, Controller, Get, Path, Post, Queries, Route, Security, Tags, SuccessResponse, Delete, Put } from "tsoa";
import { CollectionService } from "../services";
import { CreateCollection, AppQueryParams, UpdateCollection, AppGetAll } from "../interfaces";
import { Collections } from "../schemas";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController extends Controller {

    @Get("sync")
    @Security("jwt")
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
    @Security("jwt")
    public async getCollections(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new CollectionService().getAll(queryParams);
    }

    @Get("{collectionId}")
    @Security("jwt")
    public async get(
        @Path() collectionId: string
    ): Promise<Collections> {
        return new CollectionService().get(collectionId, 'collectionId');
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async createCollection(
        @Body() request: CreateCollection)
        : Promise<void> {
        this.setStatus(201)
        await new CollectionService().create(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{collectionId}")
    @Security("jwt")
    public async update(
        @Path() collectionId: string,
        @Body() request: UpdateCollection
    ): Promise<void> {
        await new CollectionService().update(request, collectionId, 'collectionId');
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{collectionId}")
    @Security("jwt")
    public async delete(
        @Path() collectionId: string,
    ): Promise<void> {
        await new CollectionService().delete(collectionId, 'collectionId');
        return;
    }
}