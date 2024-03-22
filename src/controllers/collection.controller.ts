
import { Body, Controller, Get, Path, Post, Queries, Route, Security, Tags, SuccessResponse, Delete, Put, Request } from "tsoa";
import { CollectionService } from "../services";
import { CreateCollection, AppQueryParams, UpdateCollection, AppGetAll } from "../interfaces";
import { Collections } from "../schemas";
import { Status } from "../enums";

@Route("api/collection")
@Tags("Efficacy Collection APIs")
export class CollectionController extends Controller {

    @Get("sync")
    @Security("jwt")
    public async syncCollections(
    ): Promise<void> {
        await new CollectionService(null).syncCollections();
        return;
    }

    @Get()
    @Security("jwt")
    public async getCollections(
        @Queries() queryParams: AppQueryParams
    ): Promise<AppGetAll> {
        return new CollectionService(null).getAll(queryParams, Status.ACTIVE);
    }

    @Get("{collectionId}")
    @Security("jwt")
    public async get(
        @Path() collectionId: string
    ): Promise<Collections> {
        return new CollectionService(null).get(collectionId);
    }

    @SuccessResponse("201", "Created")
    @Post()
    @Security("jwt")
    public async createCollection(
        @Request() req: any,
        @Body() request: CreateCollection
        ): Promise<void> {
        this.setStatus(201)
        await new CollectionService(req.user.email).createCollection(request);
        return;
    }

    @SuccessResponse("200", "Updated")
    @Put("{collectionId}")
    @Security("jwt")
    public async update(
        @Request() req: any,
        @Path() collectionId: string,
        @Body() request: UpdateCollection
    ): Promise<void> {
        await new CollectionService(req.user.email).update(request, collectionId, 'collectionId');
        return;
    }

    @SuccessResponse("200", "Updated")
    @Delete("{collectionId}")
    @Security("jwt")
    public async delete(
        @Request() req: any,
        @Path() collectionId: string,
    ): Promise<void> {
        await new CollectionService(req.user.email).deleteCollection(collectionId);
        return;
    }
}